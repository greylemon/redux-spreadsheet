import React, { Fragment, CSSProperties } from 'react'
// import {
//   ACTIVE_SELECTION_BORDER_STYLE,
//   STAGNANT_SELECTION_BORDER_STYLE,
//   SELECTION_BORDER_WIDTH,
//   SELECTION_BORDER_COLOR,
// } from '../styles/constants'
// import { normalizeColumnWidth, normalizeRowHeight } from '../tools/dimensions'
// import {
//   IColumnWidths,
//   IColumnOffsets,
//   IRowHeights,
//   IRowOffsets,
//   IArea,
//   IFreezeColumnCount,
//   IFreezeRowCount,
// } from '../../../@types/excel/state'
import {
  ICheckIsActiveCellInCorrectPane,
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
} from '../../../@types/excel/functions'
import CommonActivityPane from './CommonPane'
import {
  IColumnWidths,
  IColumnOffsets,
  IRowHeights,
  IRowOffsets,
  ISelectionArea,
  IFreezeColumnCount,
  IFreezeRowCount,
} from '../../../@types/excel/state'
import { normalizeColumnWidth, normalizeRowHeight } from '../tools/dimensions'

const computeSelectionAreaStyle: IComputeSelectionAreaStyle = (
  columnWidths: IColumnWidths,
  columnOffsets: IColumnOffsets,
  rowHeights: IRowHeights,
  rowOffsets: IRowOffsets,
  freezeColumnCount: IFreezeColumnCount,
  freezeRowCount: IFreezeRowCount,
  selectionArea?: ISelectionArea
) => {
  if(!selectionArea) return {}

  let selectionAreaWidth
  let selectionAreaHeight
  let left
  let top

  const { start, end } = selectionArea!

  const customSelectionStyle: CSSProperties = {}

  const topStart = rowOffsets[start.y]
  const leftStart = columnOffsets[start.x]
  const widthStart = normalizeColumnWidth(start.x, columnWidths)
  const heightStart = normalizeRowHeight(start.y, rowHeights)

  const topEnd = rowOffsets[end.y]
  const leftEnd = columnOffsets[end.x]
  const widthEnd = normalizeColumnWidth(end.x, columnWidths)
  const heightEnd = normalizeRowHeight(end.y, rowHeights)

  const topFrozenEnd = rowOffsets[freezeRowCount]
  const leftFrozenEnd = columnOffsets[freezeColumnCount]
  const widthFrozenEnd = normalizeColumnWidth(freezeColumnCount, columnWidths)
  const heightFrozenEnd = normalizeRowHeight(freezeRowCount, rowHeights)

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
  }

  customSelectionStyle.left = left
  customSelectionStyle.top = top
  customSelectionStyle.width = selectionAreaWidth
  customSelectionStyle.height = selectionAreaHeight

  return customSelectionStyle
}

const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x > freezeColumnCount && position.y > freezeRowCount

const checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane = (
  freezeColumnCount,
  freezeRowCount,
  area
) =>
  (area!.start.x > freezeColumnCount || area!.end.x > freezeColumnCount) &&
  (area!.start.y > freezeRowCount || area!.end.y > freezeRowCount)

const BottomRightPane = () => (
  <Fragment>
    <CommonActivityPane
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      // isActiveCellInCorrectPane={isActiveCellInCorrectPane}
      // isRelevantArea={isRelevantArea}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    />
  </Fragment>
)

export default BottomRightPane
