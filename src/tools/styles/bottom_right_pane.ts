import {
  IComputeSelectionAreaStyle,
  ICheckIsActiveCellInCorrectPane,
  ICheckIsAreaInRelevantPane,
  ICheckIsDragColumnOffsetInCorrectPane,
  ICheckIsDragRowOffsetInCorrectPane,
} from '../../@types/functions'
import {
  IColumnWidths,
  IColumnOffsets,
  IRowHeights,
  IRowOffsets,
  IFreezeColumnCount,
  IFreezeRowCount,
  ISelectionArea,
} from '../../@types/state'
import { CSSProperties } from 'react'
import {
  STYLE_SELECTION_BORDER_WIDTH,
  STYLE_SELECTION_BORDER_COLOR,
  STYLE_SELECTION_BORDER_STYLE,
  STYLE_SELECTION_AREA_Z_INDEX,
} from '../../constants/styles'
import { normalizeColumnWidthFromArray, normalizeRowHeightFromArray } from '..'

export const computeSelectionAreaBottomRightStyle: IComputeSelectionAreaStyle = (
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
  let left: number
  let top: number

  const { start, end } = selectionArea

  const customSelectionStyle: CSSProperties = {
    borderBottomWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderBottomColor: STYLE_SELECTION_BORDER_COLOR,
    borderBottomStyle: STYLE_SELECTION_BORDER_STYLE,
    borderRightWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderRightColor: STYLE_SELECTION_BORDER_COLOR,
    borderRightStyle: STYLE_SELECTION_BORDER_STYLE,
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

  if (
    freezeColumnCount &&
    (start.x <= freezeColumnCount || end.x <= freezeColumnCount)
  ) {
    left = leftFrozenEnd + widthFrozenEnd

    if (start.x <= end.x) {
      selectionAreaWidth = leftEnd + widthEnd - left
    } else {
      selectionAreaWidth = leftStart + widthStart - left
    }
  } else {
    if (start.x <= end.x) {
      selectionAreaWidth = leftEnd + widthEnd - leftStart
      left = leftStart
    } else {
      selectionAreaWidth = leftStart + widthStart - leftEnd
      left = leftEnd
    }

    customSelectionStyle.borderLeftWidth = STYLE_SELECTION_BORDER_WIDTH
    customSelectionStyle.borderLeftColor = STYLE_SELECTION_BORDER_COLOR
    customSelectionStyle.borderLeftStyle = STYLE_SELECTION_BORDER_STYLE
  }

  if (
    freezeRowCount &&
    (start.y <= freezeRowCount || end.y <= freezeRowCount)
  ) {
    top = topFrozenEnd + heightFrozenEnd

    if (start.y <= end.y) {
      selectionAreaHeight = topEnd + heightEnd - top
    } else {
      selectionAreaHeight = topStart + heightStart - top
    }
  } else {
    if (start.y <= end.y) {
      selectionAreaHeight = topEnd + heightEnd - topStart
      top = topStart
    } else {
      selectionAreaHeight = topStart + heightStart - topEnd
      top = topEnd
    }

    customSelectionStyle.borderTopWidth = STYLE_SELECTION_BORDER_WIDTH
    customSelectionStyle.borderTopColor = STYLE_SELECTION_BORDER_COLOR
    customSelectionStyle.borderTopStyle = STYLE_SELECTION_BORDER_STYLE
  }

  customSelectionStyle.left = left
  customSelectionStyle.top = top
  customSelectionStyle.width = selectionAreaWidth - 1
  customSelectionStyle.height = selectionAreaHeight - 1

  return customSelectionStyle
}

export const checkIsActiveCellInBottomRightPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x > freezeColumnCount && position.y > freezeRowCount

export const checkIsAreaInBottomRightPane: ICheckIsAreaInRelevantPane = (
  freezeColumnCount,
  freezeRowCount,
  area
) =>
  (area.start.x > freezeColumnCount || area.end.x > freezeColumnCount) &&
  (area.start.y > freezeRowCount || area.end.y > freezeRowCount)

export const checkIsDragColumnOffsetInBottomRightPane: ICheckIsDragColumnOffsetInCorrectPane = (
  freezeColumnCount,
  freezeRowCount
) => !freezeRowCount && !freezeColumnCount

export const checkIsDragRowOffsetInBottomRightPane: ICheckIsDragRowOffsetInCorrectPane = (
  freezeColumnCount,
  freezeRowCount
) => !freezeRowCount && !freezeColumnCount
