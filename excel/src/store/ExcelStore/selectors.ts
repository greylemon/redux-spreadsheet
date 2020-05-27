import { createSelector } from 'reselect'
import { IExcelState } from '../../@types/excel/state'
import {
  getColumnOffsets,
  getRowOffsets,
} from '../../components/Excel/tools/dimensions'
import IRootStore from '../../@types/store'

// The object parameter here is received from the input of the selectors
// In this case, the Excel store's `present` values are received

const selectUndoxExcel = (state: IRootStore) => state.Excel

const selectExcel = createSelector(
  [selectUndoxExcel],
  (undoxExcel) => undoxExcel.present
)

const getColumnWidths = createSelector(
  [selectExcel],
  (excel) => excel.columnWidths
)

const getColumnCount = createSelector(
  [selectExcel],
  (excel) => excel.columnCount
)

const getRowHeights = createSelector([selectExcel], (excel) => excel.rowHeights)

const getRowCount = createSelector([selectExcel], (excel) => excel.rowCount)

/**
 * Selectors are functions, whose return values are memoized
 * This is used for performance where you do not want to recompute
 * the values in the useSelector output
 * ```
 *  Note from: https://react-redux.js.org/api/hooks#using-memoizing-selectors
 *  However, memoizing selectors (e.g. created via createSelector from reselect)
 *  do have internal state, and therefore care must be taken when using them
 * ```
 */

export const selectColumnoffsets = createSelector(
  [getColumnWidths, getColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [getRowHeights, getRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)
