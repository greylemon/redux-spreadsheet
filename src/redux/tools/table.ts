import {
  SHEET_MIN_COLUMN_COUNT,
  SHEET_MIN_ROW_COUNT,
} from '../../constants/defaults'

export const getTableColumnCount = (columnCount: number): number =>
  Math.max(SHEET_MIN_COLUMN_COUNT, columnCount)
export const getTableRowCount = (rowCount: number): number =>
  Math.max(SHEET_MIN_ROW_COUNT, rowCount)
