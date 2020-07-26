import { IExcelState, IArea } from '../../@types/state'
import {
  nSelectActiveSheet,
  nSelectMergeCell,
  nSelectActiveSheetData,
  nSelectActiveCell,
} from '../tools/selectors'
import {
  checkIsAreaEqualPosition,
  getAreaRanges,
  getOrderedAreaFromArea,
} from '../../tools/area'

import { TYPE_MERGE, TYPE_TEXT } from '../../constants/types'

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

export const MERGE_AREA = (state: IExcelState): IExcelState => {
  const activeCell = nSelectActiveCell(state)
  if (
    (state.inactiveSelectionAreas.length !== 1 ||
      state.isSelectionMode ||
      checkIsAreaEqualPosition(state.inactiveSelectionAreas[0])) &&
    (!activeCell ||
      state.inactiveSelectionAreas.length !== 0 ||
      activeCell.type === TYPE_MERGE ||
      activeCell.merged === undefined)
  )
    return state

  const mergedArea = nSelectMergeCell(state)

  const data = nSelectActiveSheetData(state)

  if (state.inactiveSelectionAreas.length === 0) {
    // Colapse merge area
    const { xRange, yRange } = getAreaRanges(mergedArea)

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex += 1
      ) {
        if (rowIndex !== yRange.start || columnIndex !== xRange.start)
          delete data[rowIndex][columnIndex]
      }
    }

    delete data[yRange.start][xRange.start].merged
  } else {
    // Expand merge area
    const inactiveSelectionArea = state.inactiveSelectionAreas[0]
    const data = nSelectActiveSheetData(state)
    const mergedArea: IArea = getOrderedAreaFromArea(inactiveSelectionArea)

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
