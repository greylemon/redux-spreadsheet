import { PayloadAction } from '@reduxjs/toolkit'
import { IPosition, IExcelState, IArea } from '../../../../@types/excel/state'
import { getEntireSuperArea } from '../../tools/merge'
import { checkIsCellPositionValid } from '../../tools/validation'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  state.selectionAreaIndex = state.stagnantSelectionAreas.length + 1
  state.activeCellPosition = position

  return state
}

export const CELL_MOUSE_DOWN_SHIFT = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const activeCellPosition = state.activeCellPosition
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  const orderedArea: IArea = {
    start: {
      y: Math.min(position.y, activeCellPosition.y),
      x: Math.min(position.x, activeCellPosition.x),
    },
    end: {
      y: Math.max(position.y, activeCellPosition.y),
      x: Math.max(position.x, activeCellPosition.x),
    },
  }

  state.selectionArea = getEntireSuperArea(orderedArea, state.data)
  state.selectionAreaIndex = 0
  state.stagnantSelectionAreas = []

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
    state.selectionArea!.end = position
  }

  return state
}

export const CELL_MOUSE_UP = (state: IExcelState) => {
  state.isSelectionMode = false

  state.stagnantSelectionAreas.push(state.selectionArea!)
  state.selectionArea = undefined

  return state
}
