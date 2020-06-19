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
  }

  const minTop = start.y < end.y ? topStart : topEnd
  const top = minTop

  if (start.y > freezeRowCount || end.y > freezeRowCount) {
    if (start.y < end.y) {
      selectionAreaHeight = topFrozenEnd + heightFrozenEnd - minTop
    } else {
      selectionAreaHeight = topFrozenEnd + heightFrozenEnd - minTop
    }
  } else {
    if (start.y < end.y) {
      selectionAreaHeight = topEnd + heightEnd - minTop
    } else {
      selectionAreaHeight = topStart + heightStart - minTop
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
  (area!.start.x <= freezeColumnCount || area!.end.x <= freezeColumnCount) &&
  (area!.start.y <= freezeRowCount || area!.end.y <= freezeRowCount)

const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x <= freezeColumnCount && position.y <= freezeRowCount

const TopLeftPane = () => (
  <Fragment>
    <CommonActivityPane
      computeSelectionAreaStyle={computeSelectionAreaStyle}
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
    />
  </Fragment>
)

export default TopLeftPane
