import { PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'clone-deep'
import { IExcelState, IArea } from '../../@types/state'
import {
  nSelectActiveSheet,
  nSelectMergeCellArea,
  nSelectActiveSheetData,
  nSelectActiveCellStyle,
  nSelectActiveCell,
} from '../tools/selectors'
import { getAreaRanges, getOrderedAreaFromArea } from '../../tools/area'

import { TYPE_MERGE } from '../../constants/types'
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
  const { inactiveSelectionAreas } = action.payload

  if (inactiveSelectionAreas.length === 0) {
    // Colapse merge area
    const mergedArea = nSelectMergeCellArea(state)
    const { xRange, yRange } = getAreaRanges(mergedArea)

    const topLeftCell = cloneDeep(data[yRange.start][xRange.start])
    delete topLeftCell.merged
    const { activeCellPosition } = state

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex += 1
      ) {
        data[rowIndex][columnIndex] = {
          style: data[rowIndex][columnIndex].style,
        }
      }
    }

    state.inactiveSelectionAreas = [mergedArea]
    data[activeCellPosition.y][activeCellPosition.x] = topLeftCell
  } else {
    // Expand merge area
    const inactiveSelectionArea = inactiveSelectionAreas[0]
    const mergedArea: IArea = getOrderedAreaFromArea(inactiveSelectionArea)
    const blockStyle = nSelectActiveCellStyle(state)
    const cell = cloneDeep(nSelectActiveCell(state))

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
            merged: {
              parent: mergedArea.start,
            },
          }

        if (blockStyle) data[rowIndex][columnIndex].style = blockStyle
      }
    }

    if (!data[mergedArea.start.y]) data[mergedArea.start.y] = {}

    data[mergedArea.start.y][mergedArea.start.x] = cell || {}

    data[mergedArea.start.y][mergedArea.start.x].merged = {
      area: mergedArea,
    }

    state.inactiveSelectionAreas = []
    state.selectionAreaIndex = -1
  }

  return state
}
