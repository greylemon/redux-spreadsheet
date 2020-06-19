import { createSelector } from 'reselect'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
  getAreaDimensions,
} from '../../components/Excel/tools/dimensions'
import IRootStore from '../../@types/redux/store'
import {
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
} from '../../@types/excel/functions'
import { IPosition } from '../../@types/excel/state'
import { CSSProperties } from 'react'
import memoize from 'fast-memoize'

export const selectUndoxExcel = (state: IRootStore) => state.Excel

export const selectExcel = createSelector(
  [selectUndoxExcel],
  (undoxExcel) => undoxExcel.present
)

// ===========================================================================
// EXCEL BASE SELECTORS
// ===========================================================================

export const selectIsEditMode = createSelector(
  [selectExcel],
  (excel) => excel.isEditMode
)

export const selectCellEditorState = createSelector(
  [selectExcel],
  (excel) => excel.editorState
)

export const selectSheetNames = createSelector(
  [selectExcel],
  (excel) => excel.sheetNames
)

export const selectActiveSheetName = createSelector(
  [selectExcel],
  (excel) => excel.activeSheetName
)

export const selectSheetsMap = createSelector(
  [selectExcel],
  (excel) => excel.sheetsMap
)

// ===========================================================================
// ACTIVE SHEET
// ===========================================================================

export const selectActiveSheet = createSelector(
  [selectSheetsMap, selectActiveSheetName],
  (sheetsMap, activeSheeName) => sheetsMap[activeSheeName]
)

export const selectFreezeRowCount = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.freezeRowCount
)

export const selectFreezeColumnCount = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.freezeColumnCount
)

export const selectActiveCellPosition = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.activeCellPosition
)

export const selectSelectionArea = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.selectionArea
)

export const selectInactiveSelectionAreas = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.inactiveSelectionAreas
)

export const selectColumnWidths = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.columnWidths
)

export const selectData = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.data
)

export const selectColumnCount = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.columnCount
)

export const selectRowHeights = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.rowHeights
)

export const selectRowCount = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.rowCount
)

// ===========================================================================
// CUSTOM SELECTORS
// ===========================================================================
export const selectColumnoffsets = createSelector(
  [selectColumnWidths, selectColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [selectRowHeights, selectRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)

export const selectGetRowHeight = createSelector(
  [selectRowHeights],
  (rowHeights) => (index: number) =>
    normalizeRowHeightFromArray(index, rowHeights)
)

export const selectGetColumnWidth = createSelector(
  [selectColumnWidths],
  (columnWidths) => (index: number) =>
    normalizeColumnWidthFromArray(index, columnWidths)
)

export const selectIsActiveCellPositionEqualSelectionArea = createSelector(
  [selectActiveCellPosition, selectSelectionArea],
  (activeCellPosition, selectionArea) => {
    if (!selectionArea) return true

    const { start, end } = selectionArea

    return (
      activeCellPosition.x === start.x &&
      activeCellPosition.x === end.x &&
      activeCellPosition.y === start.y &&
      activeCellPosition.y === end.y
    )
  }
)

export const selectColumnWidthsAdjusted = createSelector(
  [selectColumnWidths, selectColumnoffsets, selectColumnCount],
  (columnWidths, columnOffsets, columnCount) =>
    columnOffsets.map(
      (offset) =>
        columnOffsets[columnCount - 1] +
        normalizeColumnWidthFromArray(columnCount - 1, columnWidths) -
        offset
    )
)

export const selectActiveSheetNameIndex = createSelector(
  [selectActiveSheetName, selectSheetNames],
  (activeSheetName, sheetNames) =>
    sheetNames.findIndex((name) => activeSheetName === name)
)

// ===========================================================================
// CUSTOM SELECTOR FACTORIES
// ===========================================================================
export const selectRowDataFactory = memoize((row: number) =>
  createSelector([selectData], (data) => data[row])
)

export const selectCellFactory = memoize((position: IPosition) =>
  createSelector([selectRowDataFactory(position.y)], (rowData) =>
    rowData ? rowData[position.x] : undefined
  )
)

export const selectCellMergeFactory = memoize((position: IPosition) =>
  createSelector([selectCellFactory(position)], (cell) =>
    cell ? cell.merged : undefined
  )
)

export const selectFactoryIsAreaInRelevantPane = memoize(
  (checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane) =>
    createSelector(
      [selectFreezeColumnCount, selectFreezeRowCount, selectSelectionArea],
      checkIsAreaInRelevantPane
    )
)

export const selectFactoryActiveCellStyle = memoize(
  (computeActiveCellStyle?: IComputeActiveCellStyle) => (state: IRootStore) =>
    createSelector(
      [
        selectFreezeRowCount,

        selectColumnCount,
        selectRowCount,

        selectColumnWidths,
        selectRowHeights,

        selectColumnoffsets,
        selectRowOffsets,

        selectData,

        selectActiveCellPosition,
      ],
      (
        freezeRowCount,

        columnCount,
        rowCount,

        columnWidths,
        rowHeights,

        columnOffsets,
        rowOffsets,

        data,

        activeCellPosition
      ) => {
        let activeCellStyle: CSSProperties

        if (computeActiveCellStyle) {
          activeCellStyle = computeActiveCellStyle(
            activeCellPosition,
            columnWidths,
            columnOffsets,
            rowHeights,
            rowOffsets,
            freezeRowCount,
            data
          )
          activeCellStyle.minHeight = activeCellStyle.height
          activeCellStyle.minWidth = activeCellStyle.width
        } else {
          let height, width, top, left

          const cellMergeArea = selectCellMergeFactory(activeCellPosition)(
            state
          )

          if (cellMergeArea) {
            const mergeDimensions = getAreaDimensions(
              cellMergeArea,
              rowOffsets,
              columnOffsets,
              columnWidths,
              rowHeights
            )

            height = mergeDimensions.height
            width = mergeDimensions.width

            top = rowOffsets[cellMergeArea.start.y]
            left = columnOffsets[cellMergeArea.start.x]
          } else {
            top = rowOffsets[activeCellPosition.y]
            left = columnOffsets[activeCellPosition.x]

            height = normalizeRowHeightFromArray(
              activeCellPosition.y,
              rowHeights
            )
            width = normalizeColumnWidthFromArray(
              activeCellPosition.x,
              columnWidths
            )
          }

          activeCellStyle = {
            top,
            left,
            height,
            width,
            minHeight: height,
            minWidth: width,
          }
        }

        activeCellStyle.maxWidth =
          columnOffsets[columnCount - 1] +
          normalizeColumnWidthFromArray(columnCount, columnWidths) -
          columnOffsets[activeCellPosition.x]
        activeCellStyle.maxHeight =
          rowOffsets[rowCount - 1] +
          normalizeRowHeightFromArray(rowCount, rowHeights) -
          rowOffsets[activeCellPosition.y]

        return activeCellStyle
      }
    )(state)
)

export const selectFactorySelectionAreaStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
) =>
  createSelector(
    [
      selectColumnWidths,
      selectColumnoffsets,
      selectRowHeights,
      selectRowOffsets,
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectSelectionArea,
    ],
    computeSelectionAreaStyle
  )

export const selectFactoryInactiveSelectionAreasStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle,
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) =>
  createSelector(
    [
      selectColumnWidths,
      selectColumnoffsets,
      selectRowHeights,
      selectRowOffsets,
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectInactiveSelectionAreas,
    ],
    (
      columnWidths,
      columnOffsets,
      rowHeights,
      rowOffsets,
      freezeColumnCount,
      freezeRowCount,
      inactiveSelectionAreas
    ) =>
      inactiveSelectionAreas
        .filter((inactiveSelectionArea) =>
          checkIsAreaInRelevantPane(
            freezeColumnCount,
            freezeRowCount,
            inactiveSelectionArea
          )
        )
        .map((inactiveSelectionArea) =>
          computeSelectionAreaStyle(
            columnWidths,
            columnOffsets,
            rowHeights,
            rowOffsets,
            freezeColumnCount,
            freezeRowCount,
            inactiveSelectionArea
          )
        )
  )
