/* eslint-disable */
import { createSelector } from '@reduxjs/toolkit'
import {
  normalizeRowHeightFromArray,
  normalizeColumnWidthFromArray,
  getAreaDimensions,
} from '../../tools/dimensions'
import {
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  ICheckIsAreaInRelevantPane,
  ICheckIsActiveCellInCorrectPane,
  ICheckIsDragColumnOffsetInCorrectPane,
  ICheckIsDragRowOffsetInCorrectPane,
} from '../../@types/functions'
import { CSSProperties } from 'react'
import { STYLE_ACTIVE_CELL_Z_INDEX } from '../../constants/styles'
import {
  selectActiveCellPosition,
  selectSelectionArea,
  selectInactiveSelectionAreas,
  selectDragColumnOffset,
  selectDragRowOffset,
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
  selectColumnOffsets,
  selectRowOffsets,
  selectGetColumnWidth,
  selectGetRowHeight,
} from './custom'
import { IArea } from '../../@types/state'

export const selectFactoryIsAreaInRelevantPane = (
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) =>
  createSelector(
    [selectSelectionArea, selectFreezeColumnCount, selectFreezeRowCount],
    (selectionArea, freezeColumnCount, freezeRowCount) =>
      selectionArea &&
      checkIsAreaInRelevantPane(
        freezeColumnCount,
        freezeRowCount,
        selectionArea
      )
  )

export const selectFactoryIsActiveCellInRelevantPane = (
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
) =>
  createSelector(
    [selectActiveCellPosition, selectFreezeColumnCount, selectFreezeRowCount],
    (activeCellPosition, freezeColumnCount, freezeRowCount) =>
      checkIsActiveCellInCorrectPane(
        activeCellPosition,
        freezeColumnCount,
        freezeRowCount
      )
  )

export const selectFactorySelectionAreaStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
) =>
  createSelector(
    [
      selectColumnWidths,
      selectColumnOffsets,
      selectRowHeights,
      selectRowOffsets,
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectSelectionArea,
    ],
    (
      columnWidths,
      columnOffsets,
      rowHeights,
      rowOffsets,
      freezeColumnCount,
      freezeRowCount,
      selectionArea
    ) =>
      computeSelectionAreaStyle(
        columnWidths,
        columnOffsets,
        rowHeights,
        rowOffsets,
        freezeColumnCount,
        freezeRowCount,
        selectionArea
      )
  )

export const selectFactoryActiveCellStyle = (
  computeActiveCellStyle?: IComputeActiveCellStyle
) =>
  createSelector(
    [
      selectFreezeRowCount,
      selectColumnCount,
      selectRowCount,
      selectColumnWidths,
      selectRowHeights,
      selectColumnOffsets,
      selectRowOffsets,
      selectData,
      selectActiveCellPosition,
      selectMerged,
    ],
    (
      freezeRowCount,
      columnCount,
      rowCount,
      columnWidths,
      rowHeights,
      columnOffsets,
      rowOffsets,
      data,
      activeCellPosition,
      cellMergeArea
    ) => {
      let activeCellStyle: CSSProperties

      if (computeActiveCellStyle) {
        activeCellStyle = computeActiveCellStyle(
          activeCellPosition,
          columnWidths,
          columnOffsets,
          rowHeights,
          rowOffsets,
          freezeRowCount,
          data
        )
        activeCellStyle.minHeight = activeCellStyle.height
        activeCellStyle.minWidth = activeCellStyle.width

        activeCellStyle.height = +activeCellStyle.height + 1
        activeCellStyle.width = +activeCellStyle.width + 1
      } else {
        let height: number, width: number, top: number, left: number

        if (cellMergeArea) {
          let mergedArea: IArea

          if (cellMergeArea.area) {
            mergedArea = cellMergeArea.area
          } else {
            const parent = cellMergeArea.parent
            mergedArea = data[parent.y][parent.x].merged.area
          }

          const mergeDimensions = getAreaDimensions(
            mergedArea,
            rowOffsets,
            columnOffsets
          )

          height = mergeDimensions.height
          width = mergeDimensions.width

          top = rowOffsets[mergedArea.start.y]
          left = columnOffsets[mergedArea.start.x]
        } else {
          top = rowOffsets[activeCellPosition.y]
          left = columnOffsets[activeCellPosition.x]

          height = normalizeRowHeightFromArray(activeCellPosition.y, rowHeights)
          width = normalizeColumnWidthFromArray(
            activeCellPosition.x,
            columnWidths
          )
        }

        activeCellStyle = {
          top: top,
          left: left,
          height: height + 1,
          width: width + 1,
          minHeight: height + 1,
          minWidth: width + 1,
        }
      }

      activeCellStyle.maxWidth =
        columnOffsets[columnCount] +
        normalizeColumnWidthFromArray(columnCount, columnWidths) -
        columnOffsets[activeCellPosition.x]
      activeCellStyle.maxHeight =
        rowOffsets[rowCount] +
        normalizeRowHeightFromArray(rowCount, rowHeights) -
        rowOffsets[activeCellPosition.y]
      activeCellStyle.zIndex = STYLE_ACTIVE_CELL_Z_INDEX

      return activeCellStyle
    }
  )

export const selectFactoryInactiveSelectionAreasStyle = (
  computeSelectionAreaStyle: IComputeSelectionAreaStyle,
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
) =>
  createSelector(
    [
      selectColumnWidths,
      selectColumnOffsets,
      selectRowHeights,
      selectRowOffsets,
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectInactiveSelectionAreas,
    ],
    (
      columnWidths,
      columnOffsets,
      rowHeights,
      rowOffsets,
      freezeColumnCount,
      freezeRowCount,
      inactiveSelectionAreas
    ) =>
      inactiveSelectionAreas
        .filter((inactiveSelectionArea) =>
          checkIsAreaInRelevantPane(
            freezeColumnCount,
            freezeRowCount,
            inactiveSelectionArea
          )
        )
        .map((inactiveSelectionArea) =>
          computeSelectionAreaStyle(
            columnWidths,
            columnOffsets,
            rowHeights,
            rowOffsets,
            freezeColumnCount,
            freezeRowCount,
            inactiveSelectionArea
          )
        )
  )

export const selectFactoryIsDragColumnOffsetInCorrectPane = (
  checkIsDragColumnOffsetInCorrectPane: ICheckIsDragColumnOffsetInCorrectPane
) =>
  createSelector(
    [
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectDragColumnOffset,
      selectColumnOffsets,
      selectGetColumnWidth,
      selectScrollOffsetX,
    ],
    (
      freezeColumnCount,
      freezeRowCount,
      offset,
      columnOffsets,
      getColumnWidth,
      scrollOffsetX
    ) =>
      checkIsDragColumnOffsetInCorrectPane(
        freezeColumnCount,
        freezeRowCount,
        offset,
        columnOffsets,
        getColumnWidth,
        scrollOffsetX
      )
  )

export const selectFactoryIsDragRowOffsetInCorrectPane = (
  checkIsDragRowOffsetInCorrectPane: ICheckIsDragRowOffsetInCorrectPane
) =>
  createSelector(
    [
      selectFreezeColumnCount,
      selectFreezeRowCount,
      selectDragRowOffset,
      selectRowOffsets,
      selectGetRowHeight,
      selectScrollOffsetY,
    ],
    (
      freezeCount,
      freezeRowCount,
      offset,
      rowOffsets,
      getRowHeight,
      scrollOffsetY
    ) =>
      checkIsDragRowOffsetInCorrectPane(
        freezeCount,
        freezeRowCount,
        offset,
        rowOffsets,
        getRowHeight,
        scrollOffsetY
      )
  )
