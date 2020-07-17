import { createSelector } from 'reselect'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
  getAreaDimensions,
} from '../tools/dimensions'
import IRootStore from '../@types/store'
import {
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
} from '../@types/functions'
import { IExcelState } from '../@types/state'
import { CSSProperties } from 'react'
import { STYLE_ACTIVE_CELL_Z_INDEX } from '../constants/styles'
import {
  checkIsAreaInBottomLeftPane,
  computeSelectionAreaBottomLeftStyle,
  computeActiveCellBottomLeftStyle,
  checkIsActiveCellInBottomLeftPane,
} from '../tools/styles/bottom_left_pane'
import {
  computeSelectionAreaBottomRightStyle,
  checkIsAreaInBottomRightPane,
  checkIsActiveCellInBottomRightPane,
} from '../tools/styles/bottom_right_pane'
import {
  checkIsAreaInTopLeftPane,
  computeSelectionAreaTopLeftStyle,
  checkIsActiveCellInTopLeftPane,
} from '../tools/styles/top_left_pane'
import {
  computeSelectionAreaTopRightStyle,
  checkIsAreaInTopRightPane,
  checkIsActiveCellInTopRightPane,
} from '../tools/styles/top_right_pane'

export const selectExcel = (undoxExcel: IRootStore): IExcelState =>
  undoxExcel.present

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

export const selectSheetNameText = createSelector(
  [selectExcel],
  (excel) => excel.sheetNameText
)

export const selectIsSheetNameEdit = createSelector(
  [selectExcel],
  (excel) => excel.isSheetNameEdit
)

export const selectIsSheetNavigationOpen = createSelector(
  [selectExcel],
  (excel) => excel.isSheetNavigationOpen
)

export const selectSheetsMap = createSelector(
  [selectExcel],
  (excel) => excel.sheetsMap
)

export const selectSelectionArea = createSelector(
  [selectExcel],
  (excel) => excel.selectionArea
)

export const selectActiveCellPosition = createSelector(
  [selectExcel],
  (excel) => excel.activeCellPosition
)

export const selectActiveCellPositionRow = createSelector(
  [selectActiveCellPosition],
  (activeCellPosition) => activeCellPosition.y
)

export const selectActiveCellPositionColumn = createSelector(
  [selectActiveCellPosition],
  (activeCellPosition) => activeCellPosition.x
)

export const selectInactiveSelectionAreas = createSelector(
  [selectExcel],
  (excel) => excel.inactiveSelectionAreas
)

export const selectResults = createSelector(
  [selectExcel],
  (excel) => excel.results
)

export const selectIsSelectionMode = createSelector(
  [selectExcel],
  (excel) => excel.isSelectionMode
)

export const selectScrollOffset = createSelector(
  [selectExcel],
  (excel) => excel.scrollOffset
)

// ===========================================================================
// ACTIVE SHEET
// ===========================================================================

export const selectActiveResults = createSelector(
  [selectResults, selectActiveSheetName],
  (results, activeSheetName) => results[activeSheetName]
)

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

export const selectColumnWidths = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.columnWidths
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

export const selectData = createSelector(
  [selectActiveSheet],
  (activeSheet) => activeSheet.data
)

export const selectRow = createSelector(
  [selectData, selectActiveCellPositionRow],
  (data, rowIndex) => data[rowIndex]
)

export const selectCell = createSelector(
  [selectRow, selectActiveCellPositionColumn],
  (row, columnIndex) => (row ? row[columnIndex] : undefined)
)

export const selectMerged = createSelector([selectCell], (cell) =>
  cell ? cell.merged : undefined
)

// ===========================================================================
// CUSTOM SELECTORS
// ===========================================================================
export const selectTableColumnCount = createSelector(
  [selectColumnCount],
  (columnCount) => columnCount + 1
)

export const selectTableRowCount = createSelector(
  [selectRowCount],
  (rowCount) => rowCount + 1
)

export const selectTableFreezeColumnCount = createSelector(
  [selectFreezeColumnCount],
  (freezeColumnCount) => freezeColumnCount + 1
)

export const selectTableFreezeRowCount = createSelector(
  [selectFreezeRowCount],
  (freezeRowCount) => freezeRowCount + 1
)

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
  [
    selectColumnWidths,
    selectColumnoffsets,
    selectColumnCount,
    selectFreezeColumnCount,
  ],
  (columnWidths, columnOffsets, columnCount, freezeColumnCount) =>
    columnOffsets.map((offset, index) => {
      const boundedColumnIndex =
        index <= freezeColumnCount ? freezeColumnCount : columnCount

      return (
        columnOffsets[boundedColumnIndex] +
        normalizeColumnWidthFromArray(boundedColumnIndex, columnWidths) -
        offset
      )
    })
)

export const selectActiveSheetNameIndex = createSelector(
  [selectActiveSheetName, selectSheetNames],
  (activeSheetName, sheetNames) =>
    sheetNames.findIndex((name) => activeSheetName === name)
)

// ===========================================================================
// CUSTOM SELECTOR FACTORIES
// ===========================================================================
const selectFactoryIsAreaInRelevantPane = (
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) =>
  createSelector(
    [selectSelectionArea, selectFreezeColumnCount, selectFreezeRowCount],
    (selectionArea, freezeColumnCount, freezeRowCount) =>
      selectionArea &&
      checkIsAreaInRelevantPane(
        freezeColumnCount,
        freezeRowCount,
        selectionArea
      )
  )

export const selectIsAreaInBottomLeftPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInBottomLeftPane
)
export const selectIsAreaInBottomRightPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInBottomRightPane
)
export const selectIsAreaInTopLeftPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInTopLeftPane
)
export const selectIsAreaInTopRightPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInTopRightPane
)

const selectFactoryActiveCellStyle = (
  computeActiveCellStyle?: IComputeActiveCellStyle
) =>
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
      selectMerged,
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
      activeCellPosition,
      cellMergeArea
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
        let height: number, width: number, top: number, left: number

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

          height = normalizeRowHeightFromArray(activeCellPosition.y, rowHeights)
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
        columnOffsets[columnCount] +
        normalizeColumnWidthFromArray(columnCount, columnWidths) -
        columnOffsets[activeCellPosition.x]
      activeCellStyle.maxHeight =
        rowOffsets[rowCount] +
        normalizeRowHeightFromArray(rowCount, rowHeights) -
        rowOffsets[activeCellPosition.y]
      activeCellStyle.zIndex = STYLE_ACTIVE_CELL_Z_INDEX

      return activeCellStyle
    }
  )

export const selectActiveCellAreaBottomLeftStyle = selectFactoryActiveCellStyle(
  computeActiveCellBottomLeftStyle
)
export const selectActiveCellAreaBottomRightStyle = selectFactoryActiveCellStyle()
export const selectActiveCellAreaTopLeftStyle = selectFactoryActiveCellStyle()
export const selectActiveCellAreaTopRightStyle = selectFactoryActiveCellStyle()

const selectFactorySelectionAreaStyle = (
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
    (
      columnWidths,
      columnOffsets,
      rowHeights,
      rowOffsets,
      freezeColumnCount,
      freezeRowCount,
      selectionArea
    ) =>
      computeSelectionAreaStyle(
        columnWidths,
        columnOffsets,
        rowHeights,
        rowOffsets,
        freezeColumnCount,
        freezeRowCount,
        selectionArea
      )
  )

export const selectSelectionAreaBottomLeftStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaBottomLeftStyle
)
export const selectSelectionAreaBottomRightStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaBottomRightStyle
)
export const selectSelectionAreaTopLeftStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaTopLeftStyle
)
export const selectSelectionAreaTopRightStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaTopRightStyle
)

const selectFactoryInactiveSelectionAreasStyle = (
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

export const selectInactiveSelectionAreasBottomLeftStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaBottomLeftStyle,
  checkIsAreaInBottomLeftPane
)

export const selectInactiveSelectionAreasBottomRightStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaBottomRightStyle,
  checkIsAreaInBottomRightPane
)

export const selectInactiveSelectionAreasTopLeftStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaTopLeftStyle,
  checkIsAreaInTopLeftPane
)

export const selectInactiveSelectionAreasTopRightStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaTopRightStyle,
  checkIsAreaInTopRightPane
)

const selectFactoryIsActiveCellInRelevantPane = (
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
) =>
  createSelector(
    [selectActiveCellPosition, selectFreezeColumnCount, selectFreezeRowCount],
    (activeCellPosition, freezeColumnCount, freezeRowCount) =>
      checkIsActiveCellInCorrectPane(
        activeCellPosition,
        freezeColumnCount,
        freezeRowCount
      )
  )

export const selectIsActiveCellInBottomLeftPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInBottomLeftPane
)
export const selectIsActiveCellInBottomRightPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInBottomRightPane
)
export const selectIsActiveCellInTopLeftPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInTopLeftPane
)
export const selectIsActiveCellInTopRightPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInTopRightPane
)
