import { createSelector } from '@reduxjs/toolkit'
import {
  selectResults,
  selectActiveSheetName,
  selectSheetsMap,
  selectActiveCellPositionRow,
  selectActiveCellPositionColumn,
} from './base'

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
