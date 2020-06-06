import { PayloadAction } from '@reduxjs/toolkit'
import { IPosition, IExcelState } from '../../../../@types/excel/state'
import { getEntireSuperArea } from '../../tools/merge'
import { checkIsCellPositionValid } from '../../tools/cell'
import { isSelectionAreaEqualPosition } from '../../tools/selectionArea'
import { getOrderedArea } from '../../tools/area'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  state.isSelectionMode = true
  state.selectionArea = { start: position, end: position }
  state.selectionAreaIndex = state.inactiveSelectionAreas.length + 1
  state.activeCellPosition = position

  return state
}

export const CELL_MOUSE_DOWN_SHIFT = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  const orderedArea = getOrderedArea(position, state.activeCellPosition)

  state.isSelectionMode = true
  state.selectionArea = getEntireSuperArea(orderedArea, state.data)
  state.selectionAreaIndex = 0
  state.inactiveSelectionAreas = []

  return state
}

export const CELL_MOUSE_DOWN = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  state.isSelectionMode = true
  state.inactiveSelectionAreas = []
  state.activeCellPosition = position
  state.selectionArea = { start: position, end: position }

  return state
}

export const CELL_MOUSE_ENTER = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  if (state.isSelectionMode) {
    const position = action.payload
    const orderedArea = getOrderedArea(position, state.activeCellPosition)

    state.selectionArea = state.selectionArea = getEntireSuperArea(
      orderedArea,
      state.data
    )
  }

  return state
}

export const CELL_MOUSE_UP = (state: IExcelState) => {
  if (!state.isSelectionMode) return state

  state.isSelectionMode = false

  if (!isSelectionAreaEqualPosition(state.selectionArea!))
    state.inactiveSelectionAreas.push(state.selectionArea!)
  state.selectionAreaIndex = state.selectionAreaIndex + 1
  state.selectionArea = undefined

  return state
}
