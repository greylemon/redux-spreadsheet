/* eslint-disable */
import { createSelector } from 'reselect'
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
} from '../../@types/functions'
import { CSSProperties } from 'react'
import { STYLE_ACTIVE_CELL_Z_INDEX } from '../../constants/styles'
import {
  selectActiveCellPosition,
  selectSelectionArea,
  selectInactiveSelectionAreas,
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
import { selectColumnoffsets, selectRowOffsets } from './custom'

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
      selectColumnoffsets,
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
      selectColumnoffsets,
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
      } else {
        let height: number, width: number, top: number, left: number

        if (cellMergeArea) {
          const mergeDimensions = getAreaDimensions(
            cellMergeArea,
            rowOffsets,
            columnOffsets,
            columnWidths,
            rowHeights
          )

          height = mergeDimensions.height
          width = mergeDimensions.width

          top = rowOffsets[cellMergeArea.start.y]
          left = columnOffsets[cellMergeArea.start.x]
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
          top,
          left,
          height,
          width,
          minHeight: height,
          minWidth: width,
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
      selectColumnoffsets,
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
