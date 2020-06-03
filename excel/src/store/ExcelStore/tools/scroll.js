// import {
//   getScrollbarSize,
//   getEstimatedTotalHeight,
//   getEstimatedTotalWidth,
//   getNormalColumnWidth,
//   getNormalRowHeight,
// } from '../../../../../tools/excel'

// import topOffsetsSelector from '../../../../../store/selectors/ui/excel/topOffsets'
// import leftOffsetsSelector from '../../../../../store/selectors/ui/excel/leftOffsets'

// import {
//   DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
//   DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
// } from '../../../../../constants/excel'

// export const scrollTo = ({
//   newState,

//   newY,
//   newX,
// }) => {
//   const {
//     sheetColumnCount,
//     sheetRowCount,
//     sheetFreezeColumnCount,
//     sheetFreezeRowCount,

//     sheetColumnWidths,
//     sheetRowHeights,

//     scrollData,
//   } = newState

//   const topOffsets = topOffsetsSelector(newState)
//   const leftOffsets = leftOffsetsSelector(newState)

//   if (newY >= sheetRowCount) {
//     newY = sheetRowCount - 1
//   } else if (newY <= 0) {
//     newY = 1
//   }

//   if (newX >= sheetColumnCount) {
//     newX = sheetColumnCount - 1
//   } else if (newX <= 0) {
//     newX = 1
//   }

//   const { scrollTop, scrollLeft } = scrollData

//   const topFreezeStart = topOffsets[sheetFreezeRowCount]
//   const leftFreezeStart = leftOffsets[sheetFreezeColumnCount]
//   const heightFreezeStart = sheetFreezeRowCount
//     ? getNormalRowHeight(sheetRowHeights[sheetFreezeRowCount])
//     : DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER
//   const widthFreezeStart = sheetFreezeColumnCount
//     ? getNormalColumnWidth(sheetColumnWidths[sheetFreezeColumnCount])
//     : DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER

//   const topActiveStart = topOffsets[newY]
//   const leftActiveStart = leftOffsets[newX]
//   const heightActiveStart = getNormalRowHeight(sheetRowHeights[newY])
//   const widthActiveStart = getNormalColumnWidth(sheetColumnWidths[newX])

//   const freezeHeight = topFreezeStart + heightFreezeStart
//   const freezeWidth = leftFreezeStart + widthFreezeStart

//   const {
//     current: {
//       props,
//       props: { height, width },
//       _instanceProps,
//     },
//   } = window.sheetGridRef

//   const scrollbarSize = getScrollbarSize()

//   let newScrollTop
//   let newScrollLeft

//   const estimatedTotalHeight = getEstimatedTotalHeight(props, _instanceProps)
//   const estimatedTotalWidth = getEstimatedTotalWidth(props, _instanceProps)

//   // The scrollbar size should be considered when scrolling an item into view,
//   // to ensure it's fully visible.
//   // But we only need to account for its size when it's actually visible.
//   const horizontalScrollbarSize =
//     estimatedTotalWidth > width ? scrollbarSize : 0
//   const verticalScrollbarSize =
//     estimatedTotalHeight > height ? scrollbarSize : 0

//   // Active cell is under freeze
//   if (newY > sheetFreezeRowCount && topActiveStart < scrollTop + freezeHeight) {
//     newScrollTop = topActiveStart - freezeHeight
//     // Beyond bottom side
//   } else if (
//     topActiveStart + heightActiveStart >
//     scrollTop + height - horizontalScrollbarSize
//   ) {
//     newScrollTop =
//       topActiveStart + heightActiveStart - height + horizontalScrollbarSize
//   }

//   if (
//     newX > sheetFreezeColumnCount &&
//     leftActiveStart < scrollLeft + freezeWidth
//   ) {
//     newScrollLeft = leftActiveStart - freezeWidth
//     // Beyond visible right side
//   } else if (
//     leftActiveStart + widthActiveStart >
//     scrollLeft + width - verticalScrollbarSize
//   ) {
//     newScrollLeft =
//       leftActiveStart + widthActiveStart - width + verticalScrollbarSize
//   }

//   if (
//     (newScrollTop !== undefined && newScrollTop !== scrollTop) ||
//     (newScrollLeft !== undefined && newScrollLeft !== scrollLeft)
//   )
//     window.sheetGridRef.current.scrollTo({
//       scrollTop: newScrollTop,
//       scrollLeft: newScrollLeft,
//     })
// }
