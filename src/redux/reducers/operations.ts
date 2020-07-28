import { PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'clone-deep'
import { IExcelState, IArea, ICell } from '../../@types/state'
import { nSelectActiveSheet, nSelectActiveSheetData } from '../tools/selectors'
import { getAreaRanges, getOrderedAreaFromArea } from '../../tools/area'

import { TYPE_MERGE } from '../../constants/types'
import { IGeneralActionPayload } from '../../@types/history'
import { getMergeArea } from '../tools/merge'

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
  action: PayloadAction<IGeneralActionPayload & { activeCell: ICell }>
): IExcelState => {
  const data = nSelectActiveSheetData(state)
  let {
    inactiveSelectionAreas,
    activeCellPosition,
    activeCell,
  } = action.payload

  activeCell = cloneDeep(activeCell)

  state.activeCellPosition = activeCellPosition

  if (inactiveSelectionAreas.length === 0) {
    // Colapse merge area
    const mergedArea = getMergeArea(data, activeCell.merged)

    const { xRange, yRange } = getAreaRanges(mergedArea)

    const topLeftCell = cloneDeep(data[yRange.start][xRange.start])
    delete topLeftCell.merged

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
      if (data[rowIndex] === undefined) data[rowIndex] = {}

      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex += 1
      ) {
        data[rowIndex][columnIndex] = {
          style: topLeftCell.style,
        }
      }
    }

    state.inactiveSelectionAreas = [mergedArea]
    data[activeCellPosition.y][activeCellPosition.x] = topLeftCell
  } else {
    // Expand merge area
    const inactiveSelectionArea = inactiveSelectionAreas[0]
    const mergedArea: IArea = getOrderedAreaFromArea(inactiveSelectionArea)
    const blockStyle = activeCell ? activeCell.style : undefined

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
            style: blockStyle,
          }
      }
    }

    if (!data[mergedArea.start.y]) data[mergedArea.start.y] = {}

    data[mergedArea.start.y][mergedArea.start.x] = activeCell || {}

    data[mergedArea.start.y][mergedArea.start.x].merged = {
      area: mergedArea,
    }

    state.inactiveSelectionAreas = []
    state.selectionAreaIndex = -1
  }

  return state
}
