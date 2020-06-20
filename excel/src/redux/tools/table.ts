import { DEFAULT } from '../../constants/defaults'

export const getTableColumnCount = (columnCount: number) =>
  Math.max(DEFAULT.minColumnCount, columnCount)
export const getTableRowCount = (rowCount: number) =>
  Math.max(DEFAULT.minRowCount, rowCount)
