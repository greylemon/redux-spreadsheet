import { IExcelState } from '../../../@types/excel/state'
import { nSelectMergeCell } from '../tools/selectors'

export const CELL_KEY_DOWN_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_DOWN = (state: IExcelState) => {
  if (state.activeCellPosition.y >= state.rowCount - 1) return state

  const mergeData = nSelectMergeCell(state.data, state.activeCellPosition)

  state.activeCellPosition.y = mergeData
    ? mergeData.end.y + 1
    : state.activeCellPosition.y + 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1

  return state
}

export const CELL_KEY_UP_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_UP = (state: IExcelState) => {
  if (state.activeCellPosition.y < 2) return state

  const mergeData = nSelectMergeCell(state.data, state.activeCellPosition)

  state.activeCellPosition.y = mergeData
    ? mergeData.end.y - 1
    : state.activeCellPosition.y - 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1

  return state
}

export const CELL_KEY_RIGHT_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_RIGHT = (state: IExcelState) => {
  if (state.activeCellPosition.x >= state.columnCount - 1) return state

  const mergeData = nSelectMergeCell(state.data, state.activeCellPosition)

  state.activeCellPosition.x = mergeData
    ? mergeData.end.x + 1
    : state.activeCellPosition.x + 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1

  return state
}

export const CELL_KEY_LEFT_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_LEFT = (state: IExcelState) => {
  if (state.activeCellPosition.x < 2) return state

  const mergeData = nSelectMergeCell(state.data, state.activeCellPosition)

  state.activeCellPosition.x = mergeData
    ? mergeData.end.x - 1
    : state.activeCellPosition.x - 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1

  return state
}
