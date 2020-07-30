import { createSelector } from '@reduxjs/toolkit'
import { CSSProperties } from 'react'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
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
