import {
  SHEET_COLUMN_WIDTH_HEADER,
  COLUMN_WIDTH_SCALE,
  ROW_HEIGHT_SCALE,
  SHEET_ROW_HEIGHT,
  SHEET_COLUMN_WIDTH,
  SHEET_ROW_HEIGHT_HEADER,
} from '../constants/defaults'
import {
  IRowHeight,
  IColumnWidth,
  IColumnWidths,
  IColumnCount,
  IRowCount,
  IRowHeights,
  IOffset,
  IRowOffsets,
  IColumnOffsets,
  IArea,
} from '../@types/state'

export const denormalizeRowHeight = (rowHeight: IRowHeight): IRowHeight =>
  rowHeight ? rowHeight / ROW_HEIGHT_SCALE : 0

export const normalizeRowHeight = (rowHeight: IRowHeight): IRowHeight =>
  rowHeight ? rowHeight * ROW_HEIGHT_SCALE : SHEET_ROW_HEIGHT

/**
 * Converts Excel scaled row height unit to normal scaled unit
 */
export const normalizeRowHeightFromArray = (
  index: number,
  rowHeights: IRowHeights
): IRowHeight => {
  if (!index) return SHEET_ROW_HEIGHT_HEADER

  const rowHeight = rowHeights[index]
  return normalizeRowHeight(rowHeight)
}

export const normalizeColumnWidth = (columnWidth: IColumnWidth): IColumnWidth =>
  columnWidth ? columnWidth * COLUMN_WIDTH_SCALE : SHEET_COLUMN_WIDTH

export const denormalizeColumnWidth = (
  columnWidth: IColumnWidth
): IColumnWidth => (columnWidth ? columnWidth / COLUMN_WIDTH_SCALE : 0)

/**
 * Converts Excel scaled column width unit to normal scaled unit
 */
export const normalizeColumnWidthFromArray = (
  index: number,
  columnWidths: IColumnWidths
): IColumnWidth => {
  if (!index) return SHEET_COLUMN_WIDTH_HEADER

  const columnWidth = columnWidths[index]

  return normalizeColumnWidth(columnWidth)
}
/**
 * Creates an offset list of the column widths
 */
export const getColumnOffsets = (
  columnWidths: IColumnWidths,
  columnCount: IColumnCount
): IOffset[] => {
  const leftOffsets = [0, SHEET_COLUMN_WIDTH_HEADER]

  for (
    let column = 2, incrementor = SHEET_COLUMN_WIDTH_HEADER;
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
): IOffset[] => {
  const topOffsets = [0, SHEET_ROW_HEIGHT_HEADER]

  for (
    let row = 2, incrementor = SHEET_ROW_HEIGHT_HEADER;
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
): { height: IRowHeight; width: IColumnWidth } => ({
  height:
    rowOffsets[area.end.y] +
    normalizeRowHeightFromArray(area.end.y, rowHeights) -
    rowHeights[area.start.y],
  width:
    columnOffsets[area.end.x] +
    normalizeColumnWidthFromArray(area.end.x, columnWidths) -
    columnWidths[area.start.x],
})
