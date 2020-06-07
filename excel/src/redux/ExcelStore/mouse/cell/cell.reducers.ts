import { PayloadAction } from '@reduxjs/toolkit'
import {
  IPosition,
  IExcelState,
  ISelectionArea,
} from '../../../../@types/excel/state'
import { getEntireSuperArea } from '../../tools/merge'
import { checkIsCellPositionValid } from '../../tools/cell'
import {
  getOrderedAreaFromPositions,
  getAndAddArea,
  getMinPositionFromArea,
} from '../../tools/area'

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

  const orderedArea = getOrderedAreaFromPositions(
    position,
    state.activeCellPosition
  )

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
    const orderedArea = getOrderedAreaFromPositions(
      position,
      state.activeCellPosition
    )

    state.selectionArea = getEntireSuperArea(orderedArea, state.data)
  }

  return state
}

export const CELL_MOUSE_UP = (
  state: IExcelState,
  action: PayloadAction<ISelectionArea>
) => {
  if (!state.isSelectionMode) return state

  const selectionArea = action.payload

  state.isSelectionMode = false

  if (selectionArea) {
    const { newAreas, superAreaIndex } = getAndAddArea(
      selectionArea,
      state.inactiveSelectionAreas
    )

    state.inactiveSelectionAreas = newAreas

    if (superAreaIndex > -1) {
      state.activeCellPosition = getMinPositionFromArea(
        state.inactiveSelectionAreas[superAreaIndex]
      )
    }
  }

  state.selectionAreaIndex = state.selectionAreaIndex + 1
  state.selectionArea = undefined

  return state
}
