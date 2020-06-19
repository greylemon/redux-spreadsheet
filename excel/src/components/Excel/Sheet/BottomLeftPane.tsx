import React, { Fragment } from 'react'
import CommonActivityPane from './CommonPane'
import {
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
  IComputeActiveCellStyle,
} from '../../../@types/excel/functions'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import {
  normalizeColumnWidthFromArray,
  normalizeRowHeightFromArray,
  normalizeColumnWidth,
  normalizeRowHeight,
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
import { nSelectMergeCell } from '../../../redux/ExcelStore/tools/selectors'

const computeActiveCellStyle: IComputeActiveCellStyle = (
  position,
  columnWidths,
  columnOffsets,
  rowHeights,
  rowOffsets,
  freezeRowCount,
  data
) => {
  let height
  let width
  let left
  let top

  const mergeData = nSelectMergeCell(data, position)

  if (mergeData) {
    const { start, end } = mergeData

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
    top,
    left,
    height,
    width,
  }

  const topFreeze = rowOffsets[freezeRowCount]
  const heightFreeze = normalizeRowHeightFromArray(freezeRowCount, rowHeights)

  activeCellStyle.top = activeCellStyle.top - topFreeze - heightFreeze

  return activeCellStyle
}

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
  let top

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
  (area!.start.y > freezeRowCount || area!.end.y > freezeRowCount)
const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x <= freezeColumnCount && position.y > freezeRowCount

const BottomLeftPane = () => (
  <Fragment>
    <CommonActivityPane
      computeSelectionAreaStyle={computeSelectionAreaStyle}
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
      computeActiveCellStyle={computeActiveCellStyle}
    />
  </Fragment>
)

export default BottomLeftPane
