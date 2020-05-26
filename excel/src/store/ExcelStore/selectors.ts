import { createSelector } from 'reselect'
import { IExcelState } from '../../@types/excel'
import {
  getColumnOffsets,
  getRowOffsets,
} from '../../components/Excel/tools/dimensions'

// The object parameter here is received from the input of the selectors
// In this case, the Excel store's `present` values are received
const getColumnWidths = ({ columnWidths }: IExcelState) => columnWidths
const getColumnCount = ({ columnCount }: IExcelState) => columnCount
const getRowHeights = ({ rowHeights }: IExcelState) => rowHeights
const getRowCount = ({ rowCount }: IExcelState) => rowCount

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

export const columnOffsetsSelector = createSelector(
  [getColumnWidths, getColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const rowOffsetsSelector = createSelector(
  [getRowHeights, getRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)
