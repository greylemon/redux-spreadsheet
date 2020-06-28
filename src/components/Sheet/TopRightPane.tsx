import React, { Fragment, FunctionComponent } from 'react'
import CommonActivityPane from './CommonPane'
import {
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
} from '../../@types/functions'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import {
  normalizeColumnWidthFromArray,
  normalizeRowHeightFromArray,
} from '../../tools/dimensions'
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
  STYLE_SELECTION_BORDER_COLOR,
  STYLE_SELECTION_BORDER_WIDTH,
  STYLE_SELECTION_BORDER_STYLE,
} from '../../constants/styles'

const computeSelectionAreaStyle: IComputeSelectionAreaStyle = (
  columnWidths: IColumnWidths,
  columnOffsets: IColumnOffsets,
  rowHeights: IRowHeights,
  rowOffsets: IRowOffsets,
  freezeColumnCount: IFreezeColumnCount,
  freezeRowCount: IFreezeRowCount,
  selectionArea?: ISelectionArea
) => {
  if (!selectionArea) return {}

  let selectionAreaWidth
  let selectionAreaHeight
  let left

  const { start, end } = selectionArea

  const customSelectionStyle: CSSProperties = {
    borderRightWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderRightColor: STYLE_SELECTION_BORDER_COLOR,
    borderRightStyle: STYLE_SELECTION_BORDER_STYLE,
    borderTopWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderTopColor: STYLE_SELECTION_BORDER_COLOR,
    borderTopStyle: STYLE_SELECTION_BORDER_STYLE,
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

    if (start.x < end.x) {
      selectionAreaWidth = leftEnd + widthEnd - left
    } else {
      selectionAreaWidth = leftStart + widthStart - left
    }
  } else {
    if (start.x < end.x) {
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

  const minTop = start.y < end.y ? topStart : topEnd
  const top = minTop

  if (start.y > freezeRowCount || end.y > freezeRowCount) {
    selectionAreaHeight = topFrozenEnd + heightFrozenEnd - top
  } else {
    if (start.y < end.y) {
      selectionAreaHeight = topEnd + heightEnd - topStart
    } else {
      selectionAreaHeight = topStart + heightStart - topEnd
    }

    customSelectionStyle.borderBottomWidth = STYLE_SELECTION_BORDER_WIDTH
    customSelectionStyle.borderBottomColor = STYLE_SELECTION_BORDER_COLOR
    customSelectionStyle.borderBottomStyle = STYLE_SELECTION_BORDER_STYLE
  }

  customSelectionStyle.left = left
  customSelectionStyle.top = top
  customSelectionStyle.width = selectionAreaWidth - 2
  customSelectionStyle.height = selectionAreaHeight - 2

  return customSelectionStyle
}

const checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane = (
  freezeColumnCount,
  freezeRowCount,
  area
) =>
  (area.start.x > freezeColumnCount || area.end.x > freezeColumnCount) &&
  (area.start.y <= freezeRowCount || area.end.y <= freezeRowCount)

const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x > freezeColumnCount && position.y <= freezeRowCount

const TopRightPane: FunctionComponent = () => (
  <Fragment>
    <CommonActivityPane
      computeSelectionAreaStyle={computeSelectionAreaStyle}
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
    />
  </Fragment>
)

export default TopRightPane
