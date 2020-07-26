import { PayloadAction } from '@reduxjs/toolkit'
import { IExcelState, IArea } from '../../@types/state'
import {
  nSelectActiveSheet,
  nSelectMergeCell,
  nSelectActiveSheetData,
  nSelectActiveCellStyle,
} from '../tools/selectors'
import { getAreaRanges, getOrderedAreaFromArea } from '../../tools/area'

import { TYPE_MERGE, TYPE_TEXT } from '../../constants/types'
import { IGeneralActionPayload } from '../../@types/history'

export const SELECT_ALL = (state: IExcelState): IExcelState => {
  if (state.isEditMode) return state

  const { columnCount, rowCount } = nSelectActiveSheet(state)

  state.inactiveSelectionAreas = [
    {
      start: { x: 1, y: 1 },
      end: { x: columnCount, y: rowCount },
    },
  ]

  state.selectionAreaIndex = 0

  return state
}

export const MERGE_AREA = (
  state: IExcelState,
  action: PayloadAction<IGeneralActionPayload>
): IExcelState => {
  const data = nSelectActiveSheetData(state)
  const { activeCellPosition, inactiveSelectionAreas } = action.payload

  state.activeCellPosition = activeCellPosition

  if (inactiveSelectionAreas.length === 0) {
    const mergedArea = nSelectMergeCell(state)
    // Colapse merge area
    const { xRange, yRange } = getAreaRanges(mergedArea)

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex += 1
      ) {
        if (rowIndex !== yRange.start || columnIndex !== xRange.start) {
          delete data[rowIndex][columnIndex].type
          delete data[rowIndex][columnIndex].merged
        }
      }
    }

    delete data[yRange.start][xRange.start].merged
  } else {
    // Expand merge area
    const inactiveSelectionArea = inactiveSelectionAreas[0]
    const mergedArea: IArea = getOrderedAreaFromArea(inactiveSelectionArea)
    const blockStyle = nSelectActiveCellStyle(state)

    for (
      let rowIndex = mergedArea.start.y;
      rowIndex <= mergedArea.end.y;
      rowIndex += 1
    ) {
      if (!data[rowIndex]) data[rowIndex] = {}
      for (
        let columnIndex = mergedArea.start.x;
        columnIndex <= mergedArea.end.x;
        columnIndex += 1
      ) {
        if (
          rowIndex !== mergedArea.start.y ||
          columnIndex !== mergedArea.start.x
        )
          data[rowIndex][columnIndex] = {
            type: TYPE_MERGE,
            merged: mergedArea,
          }

        if (blockStyle) data[rowIndex][columnIndex].style = blockStyle
      }
    }

    if (!data[mergedArea.start.y]) data[mergedArea.start.y] = {}
    if (!data[mergedArea.start.y][mergedArea.start.x])
      data[mergedArea.start.y][mergedArea.start.x] = {
        type: TYPE_TEXT,
      }

    data[mergedArea.start.y][mergedArea.start.x].merged = mergedArea
    state.inactiveSelectionAreas = []
    state.selectionAreaIndex = -1
  }

  return state
}
