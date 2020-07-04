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
} from '../@types/functions'
import { IPosition, IExcelState, IColumns, ICell, IArea } from '../@types/state'
import { CSSProperties } from 'react'
import { STYLE_ACTIVE_CELL_Z_INDEX } from '../constants/styles'
import { createFormulaParser } from '../tools/parser'
import { IFormulaMap } from '../@types/objects'
import { TYPE_FORMULA } from '../constants/cellTypes'
import { visitFormulaCell } from '../tools/formula'
// import { memoize } from 'lodash'

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

const selectSheetsData = createSelector([selectSheetsMap], (sheetsMap) => {
  const sheetsData = {}

  for (const sheetName in sheetsMap) {
    sheetsData[sheetName] = sheetsMap[sheetName].data
  }

  return sheetsData
})

export const selectFormulaResults = createSelector(
  [selectSheetsData],
  (sheetsData) => {
    const formulaMap: IFormulaMap = {}
    const parser = createFormulaParser(sheetsData, formulaMap)
    const visited = {}

    for (const sheetName in sheetsData) {
      const sheet = sheetsData[sheetName]
      for (const rowIndex in sheet) {
        const row = sheet[rowIndex]

        for (const columnIndex in row) {
          const cell = row[columnIndex]

          if (cell.type === TYPE_FORMULA) {
            if (formulaMap[sheetName] === undefined) formulaMap[sheetName] = {}
            if (formulaMap[sheetName][rowIndex] === undefined)
              formulaMap[sheetName][rowIndex] = {}
            if (formulaMap[sheetName][rowIndex][columnIndex] === undefined) {
              visitFormulaCell(
                formulaMap,
                sheet,
                visited,
                parser,
                sheetName,
                { x: +columnIndex, y: +rowIndex },
                cell.value
              )
            }
          }
        }
      }
    }

    return formulaMap
  }
)

export const selectActiveSheetFormulaResults = createSelector(
  [selectFormulaResults, selectActiveSheetName],
  (formulaResults, activeSheetName) => formulaResults[activeSheetName]
)

// ===========================================================================
// CUSTOM SELECTOR FACTORIES
// ===========================================================================
export const selectRowDataFactory = (row: number) => (
  state: IRootStore
): IColumns | undefined => selectData(state)[row]

export const selectCellFactory = (position: IPosition) => (
  state: IRootStore
): ICell | undefined => {
  const rowData = selectRowDataFactory(position.y)(state)

  return rowData ? rowData[position.x] : undefined
}

export const selectCellMergeFactory = (position: IPosition) => (
  state: IRootStore
): IArea | undefined => {
  const cell = selectCellFactory(position)(state)
  return cell ? cell.merged : undefined
}

export const selectFactoryIsAreaInRelevantPane = (
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) => (state: IRootStore): boolean | undefined => {
  const selectionArea = selectSelectionArea(state)
  return (
    selectionArea &&
    checkIsAreaInRelevantPane(
      selectFreezeColumnCount(state),
      selectFreezeRowCount(state),
      selectionArea
    )
  )
}

export const selectFactoryActiveCellStyle = (
  computeActiveCellStyle?: IComputeActiveCellStyle
) => (state: IRootStore): CSSProperties => {
  const freezeRowCount = selectFreezeRowCount(state)
  const columnCount = selectColumnCount(state)
  const rowCount = selectRowCount(state)
  const columnWidths = selectColumnWidths(state)
  const rowHeights = selectRowHeights(state)
  const columnOffsets = selectColumnoffsets(state)
  const rowOffsets = selectRowOffsets(state)
  const data = selectData(state)
  const activeCellPosition = selectActiveCellPosition(state)

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

    const cellMergeArea = selectCellMergeFactory(activeCellPosition)(state)

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
      width = normalizeColumnWidthFromArray(activeCellPosition.x, columnWidths)
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

export const selectFactorySelectionAreaStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
) => (state: IRootStore): CSSProperties =>
  computeSelectionAreaStyle(
    selectColumnWidths(state),
    selectColumnoffsets(state),
    selectRowHeights(state),
    selectRowOffsets(state),
    selectFreezeColumnCount(state),
    selectFreezeRowCount(state),
    selectSelectionArea(state)
  )

export const selectFactoryInactiveSelectionAreasStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle,
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) => (state: IRootStore): CSSProperties[] => {
  const columnWidths = selectColumnWidths(state)
  const columnOffsets = selectColumnoffsets(state)
  const rowHeights = selectRowHeights(state)
  const rowOffsets = selectRowOffsets(state)
  const freezeColumnCount = selectFreezeColumnCount(state)
  const freezeRowCount = selectFreezeRowCount(state)
  const inactiveSelectionAreas = selectInactiveSelectionAreas(state)

  return inactiveSelectionAreas
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
}
