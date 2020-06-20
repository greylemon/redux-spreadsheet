import { PayloadAction } from '@reduxjs/toolkit'
import { IPosition, IExcelState, ISelectionArea } from '../../../@types/state'
import { getEntireSuperArea } from '../../tools/merge'
import {
  checkIsCellPositionValid,
  createEditorStateFromCell,
} from '../../tools/cell'
import {
  getOrderedAreaFromPositions,
  getAndAddArea,
  getMinPositionFromArea,
  checkIsSelectionAreaEqualPosition,
  checkIsPositionEqualOtherPosition,
  getAreaFromPosition,
} from '../../tools/area'
import { nSelectCell, nSelectActiveSheet } from '../../tools/selectors'
import { createValueFromEditorState } from '../../tools/text'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const activeSheet = nSelectActiveSheet(state)
  const position = action.payload

  if (
    !checkIsCellPositionValid(
      position,
      activeSheet.columnCount,
      activeSheet.rowCount
    )
  )
    return state

  if (
    !checkIsPositionEqualOtherPosition(activeSheet.activeCellPosition, position)
  ) {
    if (!activeSheet.inactiveSelectionAreas.length) {
      activeSheet.inactiveSelectionAreas = [
        getAreaFromPosition(activeSheet.activeCellPosition),
      ]
    }
  }

  activeSheet.selectionArea = { start: position, end: position }
  activeSheet.selectionAreaIndex = activeSheet.inactiveSelectionAreas.length + 1

  activeSheet.activeCellPosition = position
  state.isEditMode = false

  return state
}

export const CELL_MOUSE_DOWN_SHIFT = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const activeSheet = nSelectActiveSheet(state)
  const position = action.payload

  if (
    !checkIsCellPositionValid(
      position,
      activeSheet.columnCount,
      activeSheet.rowCount
    )
  )
    return state

  const orderedArea = getOrderedAreaFromPositions(
    position,
    activeSheet.activeCellPosition
  )

  activeSheet.selectionArea = getEntireSuperArea(orderedArea, activeSheet.data)
  activeSheet.selectionAreaIndex = 0
  activeSheet.inactiveSelectionAreas = []
  state.isEditMode = false

  return state
}

export const CELL_MOUSE_DOWN = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const activeSheet = nSelectActiveSheet(state)
  const position = action.payload

  if (
    !checkIsCellPositionValid(
      position,
      activeSheet.columnCount,
      activeSheet.rowCount
    )
  )
    return state

  if (
    state.isEditMode &&
    !checkIsPositionEqualOtherPosition(activeSheet.activeCellPosition, position)
  ) {
    const cellValue = createValueFromEditorState(state.editorState)

    if (cellValue) {
      activeSheet.data[activeSheet.activeCellPosition.y] = {
        ...activeSheet.data[activeSheet.activeCellPosition.y],
        [activeSheet.activeCellPosition.x]: {
          value: cellValue,
        },
      }
    }
  }

  activeSheet.activeCellPosition = position
  activeSheet.inactiveSelectionAreas = []
  activeSheet.selectionArea = { start: position, end: position }
  state.isEditMode = false

  return state
}

export const CELL_MOUSE_ENTER = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  const activeSheet = nSelectActiveSheet(state)
  if (activeSheet.selectionArea) {
    const position = action.payload
    const orderedArea = getOrderedAreaFromPositions(
      position,
      activeSheet.activeCellPosition
    )

    activeSheet.selectionArea = getEntireSuperArea(
      orderedArea,
      activeSheet.data
    )
  }

  return state
}

export const CELL_MOUSE_UP = (
  state: IExcelState,
  action: PayloadAction<ISelectionArea>
) => {
  const activeSheet = nSelectActiveSheet(state)
  if (!activeSheet.selectionArea) return state

  const selectionArea = action.payload

  if (selectionArea) {
    const { newAreas, superAreaIndex } = getAndAddArea(
      selectionArea,
      activeSheet.inactiveSelectionAreas
    )
    if (
      activeSheet.inactiveSelectionAreas.length > 0 ||
      (activeSheet.inactiveSelectionAreas.length === 1 &&
        !checkIsSelectionAreaEqualPosition(
          activeSheet.inactiveSelectionAreas[0]
        )) ||
      !checkIsSelectionAreaEqualPosition(selectionArea)
    ) {
      activeSheet.inactiveSelectionAreas = newAreas
      if (superAreaIndex > -1 && superAreaIndex < newAreas.length) {
        // Area difference does not completely eliminate an area
        activeSheet.activeCellPosition = getMinPositionFromArea(
          activeSheet.inactiveSelectionAreas[superAreaIndex]
        )

        activeSheet.selectionAreaIndex = superAreaIndex
      } else if (superAreaIndex > 0) {
        // Area eliminated a block, but there are still other areas for active cell position to occupy
        activeSheet.selectionAreaIndex = superAreaIndex - 1
        activeSheet.activeCellPosition = getMinPositionFromArea(
          activeSheet.inactiveSelectionAreas[activeSheet.selectionAreaIndex]
        )
      } else {
        // Last area to eliminate - no more possible occupation
        activeSheet.selectionAreaIndex = -1
      }
    }
  }

  activeSheet.selectionAreaIndex = activeSheet.selectionAreaIndex + 1
  activeSheet.selectionArea = undefined

  return state
}

export const CELL_DOUBLE_CLICK = (state: IExcelState) => {
  const activeSheet = nSelectActiveSheet(state)
  state.isEditMode = true

  const cellValue = nSelectCell(
    activeSheet.data,
    activeSheet.activeCellPosition
  )

  state.editorState = createEditorStateFromCell(cellValue)

  return state
}
