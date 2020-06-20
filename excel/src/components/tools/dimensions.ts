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
  IRowOffsets,
  IColumnOffsets,
  IArea,
} from '../../@types/excel/state'

export const normalizeRowHeight = (rowHeight: IRowheight) =>
  rowHeight ? rowHeight * EXCEL_ROW_HEIGHT_SCALE : EXCEL_SHEET_ROW_HEIGHT

/**
 * Converts Excel scaled row height unit to normal scaled unit
 */
export const normalizeRowHeightFromArray = (
  index: number,
  rowHeights: IRowHeights
): IRowheight => {
  if (!index) return EXCEL_SHEET_ROW_HEIGHT_HEADER

  const rowHeight = rowHeights[index]
  return normalizeRowHeight(rowHeight)
}

export const normalizeColumnWidth = (columnWidth: IColumnWidth) =>
  columnWidth
    ? columnWidth * EXCEL_COLUMN_WIDTH_SCALE
    : EXCEL_SHEET_COLUMN_WIDTH

/**
 * Converts Excel scaled column width unit to normal scaled unit
 */
export const normalizeColumnWidthFromArray = (
  index: number,
  columnWidths: IColumnWidths
): IColumnWidth => {
  if (!index) return EXCEL_SHEET_COLUMN_WIDTH_HEADER

  const columnWidth = columnWidths[index]

  return normalizeColumnWidth(columnWidth)
}
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
    column <= columnCount;
    column++
  ) {
    incrementor += normalizeColumnWidthFromArray(column - 1, columnWidths)
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
    row <= rowCount;
    row++
  ) {
    incrementor += normalizeRowHeightFromArray(row - 1, rowHeights)
    topOffsets.push(incrementor)
  }

  return topOffsets
}

export const getAreaDimensions = (
  area: IArea,
  rowOffsets: IRowOffsets,
  columnOffsets: IColumnOffsets,
  columnWidths: IColumnWidths,
  rowHeights: IRowHeights
) => ({
  height:
    rowOffsets[area.end.y] +
    normalizeRowHeightFromArray(area.end.y, rowHeights) -
    rowHeights[area.start.y],
  width:
    columnOffsets[area.end.x] +
    normalizeColumnWidthFromArray(area.end.x, columnWidths) -
    columnWidths[area.start.x],
})
