import React, { Fragment } from 'react'
import CommonActivityPane from './CommonPane'
import {
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
} from '../../../@types/excel/functions'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import {
  normalizeColumnWidthFromArray,
  normalizeRowHeightFromArray,
} from '../tools/dimensions'
import {
  IColumnWidths,
  IColumnOffsets,
  IRowHeights,
  IRowOffsets,
  IFreezeColumnCount,
  IFreezeRowCount,
  ISelectionArea,
} from '../../../@types/excel/state'

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

  const { start, end } = selectionArea!

  const customSelectionStyle: CSSProperties = {}

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
  }

  customSelectionStyle.left = left
  customSelectionStyle.top = top
  customSelectionStyle.width = selectionAreaWidth
  customSelectionStyle.height = selectionAreaHeight

  return customSelectionStyle
}

const checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane = (
  freezeColumnCount,
  freezeRowCount,
  area
) =>
  (area!.start.x > freezeColumnCount || area!.end.x > freezeColumnCount) &&
  (area!.start.y <= freezeRowCount || area!.end.y <= freezeRowCount)

const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x > freezeColumnCount && position.y <= freezeRowCount

const TopRightPane = () => (
  <Fragment>
    <CommonActivityPane
      computeSelectionAreaStyle={computeSelectionAreaStyle}
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
    />
  </Fragment>
)

export default TopRightPane
