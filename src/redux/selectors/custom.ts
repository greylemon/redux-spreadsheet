import { createSelector } from 'reselect'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
} from '../../tools/dimensions'
import { CSSProperties } from 'react'
import {
  selectActiveSheetName,
  selectActiveCellPosition,
  selectSelectionArea,
  selectSheetNames,
  selectDragRowPosition as selectDragRowOffset,
  selectDragRowIndex,
  selectSheetDimensions,
  selectScrollOffset,
} from './base'
import {
  selectColumnCount,
  selectRowCount,
  selectFreezeColumnCount,
  selectFreezeRowCount,
  selectColumnWidths,
  selectRowHeights,
} from './activeSheet'
import { getScrollbarSize } from '../../tools/misc'
// ===========================================================================
// CUSTOM SELECTORS
// ===========================================================================

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

export const selectColumnoffsets = createSelector(
  [selectColumnWidths, selectColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [selectRowHeights, selectRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
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
    selectColumnoffsets,
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
    selectDragRowIndex,
    selectRowOffsets,
    selectScrollOffset,
    selectSheetDimensions,
  ],
  (dragRowOffset, dragRowIndex, rowOffsets, scrollOffsets, sheetDimensions) => {
    const style: CSSProperties = {}

    if (dragRowOffset) {
      const lowerBound = rowOffsets[dragRowIndex]
      const upperBound =
        scrollOffsets.y + sheetDimensions.y - getScrollbarSize()

      if (lowerBound <= dragRowOffset && dragRowOffset <= upperBound) {
        // console.log('here')
      }
    }

    return style
  }
)
