import React, { Fragment } from 'react'
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
  ICheckIsRelevantArea,
} from '../../../@types/excel/functions'
import CommonActivityPane from './CommonPane'

// const computeSelectionAreaStyle = (
//   columnWidths: IColumnWidths,
//   columnOffsets: IColumnOffsets,
//   rowHeights: IRowHeights,
//   rowOffsets: IRowOffsets,
//   selectionArea: IArea,
//   freezeColumnCount: IFreezeColumnCount,
//   freezeRowCount: IFreezeRowCount,
//   isActive: boolean
// ) => {
//   const borderStyle: 'dashed' | 'solid' = isActive
//     ? ACTIVE_SELECTION_BORDER_STYLE
//     : STAGNANT_SELECTION_BORDER_STYLE
//   let selectionAreaWidth
//   let selectionAreaHeight
//   let left
//   let top

//   const { start, end } = selectionArea

//   const customSelectionStyle: CSSProperties = {
//     borderBottomWidth: SELECTION_BORDER_WIDTH,
//     borderBottomColor: SELECTION_BORDER_COLOR,
//     borderBottomStyle: borderStyle,
//     borderRightWidth: SELECTION_BORDER_WIDTH,
//     borderRightColor: SELECTION_BORDER_COLOR,
//     borderRightStyle: borderStyle,
//   }

//   const topStart = rowOffsets[start.y]
//   const leftStart = columnOffsets[start.x]
//   const widthStart = normalizeColumnWidth(start.x, columnWidths)
//   const heightStart = normalizeRowHeight(start.y, rowHeights)

//   const topEnd = rowOffsets[end.y]
//   const leftEnd = columnOffsets[end.x]
//   const widthEnd = normalizeColumnWidth(end.x, columnWidths)
//   const heightEnd = normalizeRowHeight(end.y, rowHeights)

//   const topFrozenEnd = rowOffsets[freezeRowCount]
//   const leftFrozenEnd = columnOffsets[freezeColumnCount]
//   const widthFrozenEnd = normalizeColumnWidth(freezeColumnCount, columnWidths)
//   const heightFrozenEnd = normalizeRowHeight(freezeRowCount, rowHeights)

//   if (
//     freezeColumnCount &&
//     (start.x <= freezeColumnCount || end.x <= freezeColumnCount)
//   ) {
//     left = leftFrozenEnd + widthFrozenEnd

//     if (start.x <= end.x) {
//       selectionAreaWidth = leftEnd + widthEnd - left
//     } else {
//       selectionAreaWidth = leftStart + widthStart - left
//     }
//   } else {
//     if (start.x <= end.x) {
//       selectionAreaWidth = leftEnd + widthEnd - leftStart
//       left = leftStart
//     } else {
//       selectionAreaWidth = leftStart + widthStart - leftEnd
//       left = leftEnd
//     }

//     customSelectionStyle.borderLeftWidth = SELECTION_BORDER_WIDTH
//     customSelectionStyle.borderLeftColor = SELECTION_BORDER_COLOR
//     customSelectionStyle.borderLeftStyle = borderStyle
//   }

//   if (
//     freezeRowCount &&
//     (start.y <= freezeRowCount || end.y <= freezeRowCount)
//   ) {
//     top = topFrozenEnd + heightFrozenEnd

//     if (start.y <= end.y) {
//       selectionAreaHeight = topEnd + heightEnd - top
//     } else {
//       selectionAreaHeight = topStart + heightStart - top
//     }
//   } else {
//     if (start.y <= end.y) {
//       selectionAreaHeight = topEnd + heightEnd - topStart
//       top = topStart
//     } else {
//       selectionAreaHeight = topStart + heightStart - topEnd
//       top = topEnd
//     }

//     customSelectionStyle.borderTopWidth = SELECTION_BORDER_WIDTH
//     customSelectionStyle.borderTopColor = SELECTION_BORDER_COLOR
//     customSelectionStyle.borderTopStyle = borderStyle
//   }

//   customSelectionStyle.left = left
//   customSelectionStyle.top = top
//   customSelectionStyle.width = selectionAreaWidth
//   customSelectionStyle.height = selectionAreaHeight

//   return customSelectionStyle
// }

const checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane = (
  position,
  freezeColumnCount,
  freezeRowCount
) => position.x > freezeColumnCount && position.y > freezeRowCount

const checkIsRelevantArea: ICheckIsRelevantArea = (
  area,
  freezeColumnCount,
  freezeRowCount
) =>
  (area.start.x > freezeColumnCount || area.end.x > freezeColumnCount) &&
  (area.start.y > freezeRowCount || area.end.y > freezeRowCount)

// (x1 > sheetFreezeColumnCount || x2 > sheetFreezeColumnCount)
// && (y1 > sheetFreezeRowCount || y2 > sheetFreezeRowCount)

const BottomRightPane = () => (
  <Fragment>
    <CommonActivityPane
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
      checkIsRelevantArea={checkIsRelevantArea}
      // isActiveCellInCorrectPane={isActiveCellInCorrectPane}
      // isRelevantArea={isRelevantArea}
      // computeSelectionAreaStyle={computeSelectionAreaStyle}
    />
  </Fragment>
)

export default BottomRightPane
