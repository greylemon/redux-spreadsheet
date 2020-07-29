import { CSSProperties } from 'react'
import {
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
  ICheckIsDragRowOffsetInCorrectPane,
} from '../../@types/functions'
import {
  normalizeRowHeight,
  normalizeColumnWidth,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
} from '..'
import {
  IColumnWidths,
  IColumnOffsets,
  IRowHeights,
  IRowOffsets,
  IFreezeColumnCount,
  IFreezeRowCount,
  ISelectionArea,
} from '../../@types/state'
import {
  STYLE_SELECTION_BORDER_WIDTH,
  STYLE_SELECTION_BORDER_COLOR,
  STYLE_SELECTION_BORDER_STYLE,
  STYLE_SELECTION_AREA_Z_INDEX,
} from '../../constants/styles'
import { getMergeArea } from '../../redux/tools/merge'

export const computeActiveCellBottomLeftStyle: IComputeActiveCellStyle = (
  position,
  columnWidths,
  columnOffsets,
  rowHeights,
  rowOffsets,
  freezeRowCount,
  data
) => {
  let height: number
  let width: number
  let left: number
  let top: number

  const mergeData =
    data[position.y] && data[position.y][position.x]
      ? data[position.y][position.x].merged
      : undefined

  if (mergeData) {
    const { start, end } = getMergeArea(data, mergeData)

    height =
      rowOffsets[end.y] +
      normalizeRowHeight(rowHeights[end.y]) -
      rowOffsets[start.y]
    width =
      columnOffsets[end.x] +
      normalizeColumnWidth(columnWidths[end.x]) -
      columnOffsets[start.x]
    top = rowOffsets[start.y]
    left = columnOffsets[start.x]
  } else {
    height = normalizeRowHeightFromArray(position.y, rowHeights)
    width = normalizeColumnWidthFromArray(position.x, columnWidths)
    top = rowOffsets[position.y]
    left = columnOffsets[position.x]
  }

  const activeCellStyle = {
    top: top - 1,
    left: left - 1,
    height,
    width,
  }

  const topFreeze = rowOffsets[freezeRowCount]
  const heightFreeze = normalizeRowHeightFromArray(freezeRowCount, rowHeights)

  activeCellStyle.top = activeCellStyle.top - topFreeze - heightFreeze

  return activeCellStyle
}

export const computeSelectionAreaBottomLeftStyle: IComputeSelectionAreaStyle = (
  columnWidths: IColumnWidths,
  columnOffsets: IColumnOffsets,
  rowHeights: IRowHeights,
  rowOffsets: IRowOffsets,
  freezeColumnCount: IFreezeColumnCount,
  freezeRowCount: IFreezeRowCount,
  selectionArea?: ISelectionArea
) => {
  if (!selectionArea) return {}

  let selectionAreaWidth: number
  let selectionAreaHeight: number
  let top: number

  const { start, end } = selectionArea

  const customSelectionStyle: CSSProperties = {
    borderLeftWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderLeftColor: STYLE_SELECTION_BORDER_COLOR,
    borderLeftStyle: STYLE_SELECTION_BORDER_STYLE,
    borderBottomWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderBottomColor: STYLE_SELECTION_BORDER_COLOR,
    borderBottomStyle: STYLE_SELECTION_BORDER_STYLE,
    zIndex: STYLE_SELECTION_AREA_Z_INDEX,
  }

  const topStart = rowOffsets[start.y]
  const leftStart = columnOffsets[start.x]
  const widthStart = normalizeColumnWidthFromArray(start.x, columnWidths)
  const heightStart = normalizeRowHeightFromArray(start.y, rowHeights)

  const topEnd = rowOffsets[end.y]
  const leftEnd = columnOffsets[end.x]
  const widthEnd = normalizeColumnWidthFromArray(end.x, columnWidths)
  const heightEnd = normalizeRowHeightFromArray(end.y, rowHeights)

  const topFrozenEnd = rowOffsets[freezeRowCount]
  const leftFrozenEnd = columnOffsets[freezeColumnCount]
  const widthFrozenEnd = normalizeColumnWidthFromArray(
    freezeColumnCount,
    columnWidths
  )
  const heightFrozenEnd = normalizeRowHeightFromArray(
    freezeRowCount,
    rowHeights
  )

  const minLeft = start.x < end.x ? leftStart : leftEnd
  const left = minLeft

  if (start.x > freezeColumnCount || end.x > freezeColumnCount) {
    selectionAreaWidth = leftFrozenEnd + widthFrozenEnd - minLeft
  } else {
    if (start.x < end.x) {
      selectionAreaWidth = leftEnd + widthEnd - minLeft
    } else {
      selectionAreaWidth = leftStart + widthStart - minLeft
    }

    customSelectionStyle.borderRightWidth = STYLE_SELECTION_BORDER_WIDTH
    customSelectionStyle.borderRightColor = STYLE_SELECTION_BORDER_COLOR
    customSelectionStyle.borderRightStyle = STYLE_SELECTION_BORDER_STYLE
  }

  if (
    freezeRowCount &&
    (start.y <= freezeRowCount || end.y <= freezeRowCount)
  ) {
    top = 0

    if (start.y < end.y) {
      selectionAreaHeight = topEnd + heightEnd - topFrozenEnd - heightFrozenEnd
    } else {
      selectionAreaHeight =
        topStart + heightStart - topFrozenEnd - heightFrozenEnd
    }
  } else {
    if (start.y < end.y) {
      top = topStart - topFrozenEnd - heightFrozenEnd
      selectionAreaHeight = topEnd + heightEnd - topStart
    } else {
      top = topEnd - topFrozenEnd - heightFrozenEnd
      selectionAreaHeight = topStart + heightStart - topEnd
    }

    customSelectionStyle.borderTopWidth = STYLE_SELECTION_BORDER_WIDTH
    customSelectionStyle.borderTopColor = STYLE_SELECTION_BORDER_COLOR
    customSelectionStyle.borderTopStyle = STYLE_SELECTION_BORDER_STYLE
  }

  customSelectionStyle.left = left - 1
  customSelectionStyle.top = top - 1
  customSelectionStyle.width = selectionAreaWidth + 1
  customSelectionStyle.height = selectionAreaHeight + 1
  customSelectionStyle.boxSizing = 'border-box'

  return customSelectionStyle
}

export const checkIsAreaInBottomLeftPane: ICheckIsAreaInRelevantPane = (
  freezeColumnCount,
  freezeRowCount,
  area
) =>
  (area.start.x <= freezeColumnCount || area.end.x <= freezeColumnCount) &&
  (area.start.y > freezeRowCount || area.end.y > freezeRowCount)

export const checkIsActiveCellInBottomLeftPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x <= freezeColumnCount && position.y > freezeRowCount

export const checkIsDragRowOffsetInBottomLeftPane: ICheckIsDragRowOffsetInCorrectPane = (
  _freezeColumnCount,
  freezeRowCount,
  offset,
  rowOffsets,
  getRowHeight,
  scrollOffsetY
) => {
  const freezeRowLength =
    rowOffsets[freezeRowCount] + getRowHeight(freezeRowCount)
  return (
    freezeRowLength <= offset &&
    offset > freezeRowLength &&
    offset - scrollOffsetY > freezeRowLength
  )
}
