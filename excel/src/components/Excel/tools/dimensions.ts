import {
  EXCEL_SHEET_COLUMN_WIDTH_HEADER,
  EXCEL_COLUMN_WIDTH_SCALE,
  EXCEL_ROW_HEIGHT_SCALE,
  EXCEL_SHEET_ROW_HEIGHT,
  EXCEL_SHEET_COLUMN_WIDTH,
  EXCEL_SHEET_ROW_HEIGHT_HEADER,
} from '../constants'
import {
  IRowheight,
  IColumnWidth,
  IColumnWidths,
  IColumnCount,
  IRowCount,
  IRowHeights,
  IOffset,
} from '../../../@types/excel'

/**
 * Converts Excel scaled row height unit to normal scaled unit
 */
export const normalizeRowHeight = (rowHeight: IRowheight): IRowheight =>
  rowHeight ? rowHeight * EXCEL_ROW_HEIGHT_SCALE : EXCEL_SHEET_ROW_HEIGHT

/**
 * Converts Excel scaled column width unit to normal scaled unit
 */
export const normalizeColumnWidth = (columnWidth: IColumnWidth): IColumnWidth =>
  columnWidth
    ? columnWidth * EXCEL_COLUMN_WIDTH_SCALE
    : EXCEL_SHEET_COLUMN_WIDTH

/**
 * Creates an offset list of the column widths
 */
export const getColumnOffsets = (
  columnWidths: IColumnWidths,
  columnCount: IColumnCount
): Array<IOffset> => {
  const leftOffsets = [0, EXCEL_SHEET_COLUMN_WIDTH_HEADER]

  for (
    let column = 2, incrementor = EXCEL_SHEET_COLUMN_WIDTH_HEADER;
    column < columnCount;
    column++
  ) {
    incrementor += normalizeColumnWidth(columnWidths[column - 1])
    leftOffsets.push(incrementor)
  }

  return leftOffsets
}

/**
 * Creates an offset list of the row heights
 */
export const getRowOffsets = (
  rowHeights: IRowHeights,
  rowCount: IRowCount
): Array<IOffset> => {
  const topOffsets = [0, EXCEL_SHEET_ROW_HEIGHT_HEADER]

  for (
    let row = 2, incrementor = EXCEL_SHEET_ROW_HEIGHT_HEADER;
    row < rowCount;
    row++
  ) {
    incrementor += normalizeRowHeight(rowHeights[row - 1])
    topOffsets.push(incrementor)
  }

  return topOffsets
}
