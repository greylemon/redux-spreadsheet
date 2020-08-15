import { createSelector } from '@reduxjs/toolkit'
import { CSSProperties } from 'react'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
  getScrollLength,
  getScrollBlock,
} from '../../tools/dimensions'
import {
  selectActiveSheetName,
  selectActiveCellPosition,
  selectSelectionArea,
  selectSheetNames,
  selectDragRowOffset,
  selectDragColumnOffset,
  selectScrollOffsetY,
  selectScrollOffsetX,
} from './base'
import {
  selectColumnCount,
  selectRowCount,
  selectFreezeColumnCount,
  selectFreezeRowCount,
  selectColumnWidths,
  selectRowHeights,
  selectData,
  selectMerged,
} from './activeSheet'

import {
  rowDraggerStyle,
  rowDraggerIndicatorStyle,
  columnDraggerStyle,
  columnDraggerIndicatorStyle,
} from '../../constants/styles'
import { getMergeArea } from '../tools/merge'
import { getCellAddressFromPosition } from '../../tools/cell'

export const selectTableColumnCount = createSelector(
  [selectColumnCount],
  (columnCount) => columnCount + 1
)

export const selectTableRowCount = createSelector(
  [selectRowCount],
  (rowCount) => rowCount + 1
)

export const selectTableFreezeColumnCount = createSelector(
  [selectFreezeColumnCount],
  (freezeColumnCount) => freezeColumnCount + 1
)

export const selectTableFreezeRowCount = createSelector(
  [selectFreezeRowCount],
  (freezeRowCount) => freezeRowCount + 1
)

export const selectColumnOffsets = createSelector(
  [selectColumnWidths, selectColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [selectRowHeights, selectRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)

export const selectScrollHorizontalWidth = createSelector(
  [selectColumnCount, selectFreezeColumnCount],
  (columnCount, freezeColumnCount) =>
    getScrollLength(columnCount, freezeColumnCount)
)

export const selectScrollVerticalHeight = createSelector(
  [selectRowCount, selectFreezeRowCount],
  (rowCount, freezeRowCount) => getScrollLength(rowCount, freezeRowCount)
)

export const selectScrollVerticalBlock = createSelector(
  [selectRowOffsets, selectTableFreezeRowCount],
  (rowOffsets, tableFreezeRowCount) =>
    getScrollBlock(rowOffsets, tableFreezeRowCount)
)

export const selectScrollHorizontalBlock = createSelector(
  [selectColumnOffsets, selectTableFreezeColumnCount],
  (columnOffsets, tableFreezeColumnCount) =>
    getScrollBlock(columnOffsets, tableFreezeColumnCount)
)

export const selectGetRowHeight = createSelector(
  [selectRowHeights],
  (rowHeights) => (index: number) =>
    normalizeRowHeightFromArray(index, rowHeights)
)

export const selectGetColumnWidth = createSelector(
  [selectColumnWidths],
  (columnWidths) => (index: number) =>
    normalizeColumnWidthFromArray(index, columnWidths)
)

export const selectIsActiveCellPositionEqualSelectionArea = createSelector(
  [selectActiveCellPosition, selectSelectionArea],
  (activeCellPosition, selectionArea) => {
    if (!selectionArea) return true

    const { start, end } = selectionArea

    return (
      activeCellPosition.x === start.x &&
      activeCellPosition.x === end.x &&
      activeCellPosition.y === start.y &&
      activeCellPosition.y === end.y
    )
  }
)

export const selectColumnWidthsAdjusted = createSelector(
  [
    selectColumnWidths,
    selectColumnOffsets,
    selectColumnCount,
    selectFreezeColumnCount,
  ],
  (columnWidths, columnOffsets, columnCount, freezeColumnCount) =>
    columnOffsets.map((offset, index) => {
      const boundedColumnIndex =
        index <= freezeColumnCount ? freezeColumnCount : columnCount
      return (
        columnOffsets[boundedColumnIndex] +
        normalizeColumnWidthFromArray(boundedColumnIndex, columnWidths) -
        offset
      )
    })
)

export const selectActiveSheetNameIndex = createSelector(
  [selectActiveSheetName, selectSheetNames],
  (activeSheetName, sheetNames) =>
    sheetNames.findIndex((name) => activeSheetName === name)
)

export const selectRowDraggerStyle = createSelector(
  [
    selectDragRowOffset,
    selectFreezeRowCount,
    selectScrollOffsetY,
    selectRowOffsets,
    selectGetRowHeight,
  ],
  (dragRowOffset, freezeRowCount, scrollOffsetY, rowOffsets, getRowHeight) => {
    let style: CSSProperties = {}

    if (dragRowOffset) {
      style = {
        ...rowDraggerStyle,
        ...rowDraggerIndicatorStyle,
        top: dragRowOffset,
        left: 1,
        cursor: 'ns-resize',
      }

      const freezeRowLength =
        rowOffsets[freezeRowCount] + getRowHeight(freezeRowCount)

      if (
        dragRowOffset > freezeRowLength &&
        dragRowOffset - scrollOffsetY <= freezeRowLength
      ) {
        style.top = +style.top - scrollOffsetY
      }
    }

    return style
  }
)

export const selectColumnDraggerStyle = createSelector(
  [
    selectDragColumnOffset,
    selectFreezeColumnCount,
    selectScrollOffsetX,
    selectColumnOffsets,
    selectGetColumnWidth,
  ],
  (
    dragColumnOffset,
    freezeColumnCount,
    scrollOffsetX,
    columnOffsets,
    getColumnWidth
  ) => {
    let style: CSSProperties = {}

    if (dragColumnOffset) {
      style = {
        ...columnDraggerStyle,
        ...columnDraggerIndicatorStyle,
        left: dragColumnOffset,
        top: 1,
        cursor: 'ew-resize',
      }

      const freezeColumnLength =
        columnOffsets[freezeColumnCount] + getColumnWidth(freezeColumnCount)

      if (
        dragColumnOffset > freezeColumnLength &&
        dragColumnOffset - scrollOffsetX <= freezeColumnLength
      ) {
        style.left = +style.left - scrollOffsetX
      }
    }

    return style
  }
)

export const selectCellLayering = createSelector(
  [selectData, selectColumnCount, selectRowCount],
  (data, columnCount, rowCount) => {
    const layering: number[][] = []

    for (let rowIndex = 0; rowIndex <= rowCount; rowIndex += 1) {
      let layerIndex = 1
      const rowLayer: number[] = []
      const row = data[rowIndex]

      for (let columnIndex = 0; columnIndex <= columnCount; columnIndex += 1) {
        if (row && row[columnIndex] && row[columnIndex].value !== undefined)
          layerIndex += 1

        rowLayer.push(layerIndex)
      }

      layering.push(rowLayer)
    }

    return layering
  }
)

export const selectPosition = createSelector(
  [selectMerged, selectData, selectActiveCellPosition],
  (merged, data, activeCellPosition) => {
    return merged ? getMergeArea(data, merged).start : activeCellPosition
  }
)

// TODO: FIX
export const selectPositionDimensions = createSelector(
  [selectPosition, selectMerged, selectRowOffsets, selectColumnOffsets],
  (position, merged, rowOffsets, columnOffsets) => {
    let width: number
    let height: number

    if (merged) {
      width =
        columnOffsets[merged.area.end.x + 1] -
        columnOffsets[merged.area.start.x]
      height =
        rowOffsets[merged.area.end.y + 1] - rowOffsets[merged.area.start.y]
    } else {
      width = columnOffsets[position.x + 1] - columnOffsets[position.x]
      height = rowOffsets[position.y + 1] - rowOffsets[position.y]
    }

    return {
      minHeight: height + 0.5,
      minWidth: width + 0.5,
    }
  }
)

export const selectActiveCellId = createSelector(
  [selectActiveCellPosition],
  (position) => getCellAddressFromPosition(position)
)

// export const selectVisibleCellWidths = createSelector(
//   [
//     selectTopLeftPositionY,
//     selectViewRowEnd,
//     selectColumnCount,
//     selectData,
//     selectColumnOffsets,
//     selectActiveResults,
//   ],
//   (
//     topLeftPositionY,
//     viewRowEnd,
//     columnCount,
//     data,
//     columnOffsets,
//     activeResults
//   ) => {
//     if (!activeResults) activeResults = {}
//     const viewWidths: IViewWidths = {}
//     const endOffset = columnOffsets[columnOffsets.length - 1]

//     for (
//       let rowIndex = topLeftPositionY;
//       rowIndex < viewRowEnd;
//       rowIndex += 1
//     ) {
//       const row = data[rowIndex]
//       const resultRow = activeResults[rowIndex]
//       let curEndOffset = endOffset

//       for (let columnIndex = columnCount; columnIndex > 0; columnIndex -= 1) {
//         if (
//           (row && row[columnIndex] && row[columnIndex].value) ||
//           (resultRow && resultRow[columnIndex])
//         ) {
//           if (!viewWidths[rowIndex]) viewWidths[rowIndex] = {}
//           viewWidths[rowIndex][columnIndex] =
//             curEndOffset - columnOffsets[columnIndex]
//           curEndOffset = columnOffsets[columnIndex]
//         }
//       }
//     }

//     return viewWidths
//   }
// )
