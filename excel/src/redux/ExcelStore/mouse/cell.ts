import { PayloadAction } from '@reduxjs/toolkit'
import {
  IPosition,
  IExcelState,
  ISelectionArea,
} from '../../../@types/excel/state'
import { getEntireSuperArea } from '../tools/merge'
import { checkIsCellPositionValid } from '../tools/cell'
import {
  getOrderedAreaFromPositions,
  getAndAddArea,
  getMinPositionFromArea,
  checkIsSelectionAreaEqualPosition,
  checkIsPositionEqualOtherPosition,
  getAreaFromPosition,
} from '../tools/area'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const position = action.payload

  if (!checkIsCellPositionValid(position, state.columnCount, state.rowCount))
    return state

  if (
    !checkIsPositionEqualOtherPosition(state.activeCellPosition, position) &&
    !state.inactiveSelectionAreas.length
  )
    state.inactiveSelectionAreas = [
      getAreaFromPosition(state.activeCellPosition),
    ]

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

  state.inactiveSelectionAreas = []
  state.activeCellPosition = position
  state.selectionArea = { start: position, end: position }

  return state
}

export const CELL_MOUSE_ENTER = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  if (state.selectionArea) {
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
  if (!state.selectionArea) return state

  const selectionArea = action.payload

  if (selectionArea) {
    const { newAreas, superAreaIndex } = getAndAddArea(
      selectionArea,
      state.inactiveSelectionAreas
    )
    if (
      state.inactiveSelectionAreas.length > 0 ||
      (state.inactiveSelectionAreas.length === 1 &&
        !checkIsSelectionAreaEqualPosition(state.inactiveSelectionAreas[0])) ||
      !checkIsSelectionAreaEqualPosition(selectionArea)
    ) {
      state.inactiveSelectionAreas = newAreas
      if (superAreaIndex > -1 && superAreaIndex < newAreas.length) {
        // Area difference does not completely eliminate an area
        state.activeCellPosition = getMinPositionFromArea(
          state.inactiveSelectionAreas[superAreaIndex]
        )

        state.selectionAreaIndex = superAreaIndex
      } else if (superAreaIndex > 0) {
        // Area eliminated a block, but there are still other areas for active cell position to occupy
        state.selectionAreaIndex = superAreaIndex - 1
        state.activeCellPosition = getMinPositionFromArea(
          state.inactiveSelectionAreas[state.selectionAreaIndex]
        )
      } else {
        // Last area to eliminate - no more possible occupation
        state.selectionAreaIndex = -1
      }
    }
  }

  state.selectionAreaIndex = state.selectionAreaIndex + 1
  state.selectionArea = undefined

  return state
}
