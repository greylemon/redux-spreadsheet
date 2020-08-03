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
  IGridMeasurements,
} from '../@types/state'

const normalizeDimension = (
  dimension: number,
  scale: number,
  defaultValue: number
) => (dimension ? dimension * scale : defaultValue)

export const normalizeRowHeight = (rowHeight: IRowHeight): IRowHeight =>
  normalizeDimension(rowHeight, ROW_HEIGHT_SCALE, SHEET_ROW_HEIGHT)

export const normalizeColumnWidth = (columnWidth: IColumnWidth): IColumnWidth =>
  normalizeDimension(columnWidth, COLUMN_WIDTH_SCALE, SHEET_COLUMN_WIDTH)

export const denormalizeDimension = (
  dimension: number,
  scale: number,
  defaultValue = 0
) => (dimension ? dimension / scale : defaultValue)

export const denormalizeRowHeight = (rowHeight: IRowHeight): IRowHeight =>
  denormalizeDimension(rowHeight, ROW_HEIGHT_SCALE)

export const denormalizeColumnWidth = (
  columnWidth: IColumnWidth
): IColumnWidth => denormalizeDimension(columnWidth, COLUMN_WIDTH_SCALE)

const normalizeHeaderDimensionFromArray = (
  index: number,
  dimensions: IGridMeasurements<number>,
  outOfRangeValue: number,
  normalizeFn: (dimension: number) => number
) => {
  if (!index) return outOfRangeValue

  const dimension = dimensions[index]
  return normalizeFn(dimension)
}

/**
 * Converts Excel scaled row height unit to normal scaled unit
 */
export const normalizeRowHeightFromArray = (
  index: number,
  rowHeights: IRowHeights
): IRowHeight =>
  normalizeHeaderDimensionFromArray(
    index,
    rowHeights,
    SHEET_ROW_HEIGHT_HEADER,
    normalizeRowHeight
  )

/**
 * Converts Excel scaled column width unit to normal scaled unit
 */
export const normalizeColumnWidthFromArray = (
  index: number,
  columnWidths: IColumnWidths
): IColumnWidth =>
  normalizeHeaderDimensionFromArray(
    index,
    columnWidths,
    SHEET_COLUMN_WIDTH_HEADER,
    normalizeColumnWidth
  )

const getHeaderOffset = (
  dimensions: IGridMeasurements<number>,
  count: number,
  initialOffset: number,
  indexNomralizeFn: (
    index: number,
    dimensions: IGridMeasurements<number>
  ) => number
) => {
  const offsets = [0, initialOffset]

  for (
    let index = 2, incrementor = initialOffset;
    index <= count + 1;
    index += 1
  ) {
    incrementor += indexNomralizeFn(index - 1, dimensions)
    offsets.push(incrementor)
  }

  return offsets
}

/**
 * Creates an offset list of the column widths
 */
export const getColumnOffsets = (
  columnWidths: IColumnWidths,
  columnCount: IColumnCount
): IOffset[] =>
  getHeaderOffset(
    columnWidths,
    columnCount,
    SHEET_COLUMN_WIDTH_HEADER,
    normalizeColumnWidthFromArray
  )

/**
 * Creates an offset list of the row heights
 */
export const getRowOffsets = (
  rowHeights: IRowHeights,
  rowCount: IRowCount
): IOffset[] =>
  getHeaderOffset(
    rowHeights,
    rowCount,
    SHEET_ROW_HEIGHT_HEADER,
    normalizeRowHeightFromArray
  )

export const getAreaDimensions = (
  area: IArea,
  rowOffsets: IRowOffsets,
  columnOffsets: IColumnOffsets
): { height: IRowHeight; width: IColumnWidth } => ({
  height: rowOffsets[area.end.y + 1] - rowOffsets[area.start.y],
  width: columnOffsets[area.end.x + 1] - columnOffsets[area.start.x],
})

export const getScrolledDimensionOffsets = (
  offsets: number[],
  freezeCount: number,
  padding: number
) =>
  offsets.map(
    (offset, index) =>
      offset -
      (index < freezeCount ? 0 : offsets[padding] - offsets[freezeCount])
  )

export const getScrollLength = (offsets: number[], freezeCount: number) =>
  offsets.length - 1 - freezeCount

export const getScrollBlock = (offsets: number[], freezeCount: number) =>
  offsets[freezeCount + 1]
/**
 * Gets the final dimension that's viewable
 */
export const getEndDimension = (
  dimension: number,
  offsets: number[],
  frozenCount: number,
  screenDimension: number,
  tableRowCount: number
): number => {
  const dimensionOffset = offsets[dimension]
  const frozenOffset = offsets[frozenCount]

  const nonFrozenLength = screenDimension - frozenOffset
  const dimensionOffsetEnd = dimensionOffset + nonFrozenLength

  let dimensionEnd = dimension
  for (let i = dimension; i <= tableRowCount; i += 1) {
    const curEndOffset = offsets[i]
    dimensionEnd = i

    if (curEndOffset > dimensionOffsetEnd) break
  }

  return dimensionEnd
}
