import { PayloadAction } from '@reduxjs/toolkit'
import {
  IPosition,
  IExcelState,
  ISelectionArea,
  IDragRowOffset,
  IDragColumnOffset,
  IDragRowIndex,
  IDragColumnIndex,
  IRowHeight,
  IColumnWidth,
} from '../../@types/state'
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
import { nSelectCell, nSelectActiveSheet } from '../tools/selectors'
import { createValueFromEditorState } from '../../tools/text'
import { updateActiveCellRef } from '../../tools/formula'
import { denormalizeRowHeight, denormalizeColumnWidth } from '../../tools'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
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

  if (!checkIsPositionEqualOtherPosition(state.activeCellPosition, position)) {
    if (!state.inactiveSelectionAreas.length) {
      state.inactiveSelectionAreas = [
        getAreaFromPosition(state.activeCellPosition),
      ]
    }
  }

  state.selectionArea = { start: position, end: position }
  state.selectionAreaIndex = state.inactiveSelectionAreas.length + 1

  state.activeCellPosition = position
  state.isEditMode = false
  state.isSelectionMode = true

  return state
}

export const CELL_MOUSE_DOWN_SHIFT = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
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
    state.activeCellPosition
  )

  state.isSelectionMode = true
  state.selectionArea = getEntireSuperArea(orderedArea, activeSheet.data)
  state.selectionAreaIndex = 0
  state.inactiveSelectionAreas = []
  state.isEditMode = false

  return state
}

export const CELL_MOUSE_DOWN = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
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
    !checkIsPositionEqualOtherPosition(state.activeCellPosition, position)
  ) {
    const cellValue = createValueFromEditorState(state.editorState)

    if (cellValue) {
      const { x, y } = state.activeCellPosition

      if (!activeSheet.data[y]) activeSheet.data[y] = {}
      if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

      activeSheet.data[y][x] = { ...activeSheet.data[y][x], ...cellValue }
    }

    updateActiveCellRef(state)
  }

  state.activeCellPosition = position
  state.inactiveSelectionAreas = []
  state.selectionArea = { start: position, end: position }
  state.isEditMode = false
  state.isSelectionMode = true

  return state
}

export const CELL_MOUSE_ENTER = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.isSelectionMode) {
    const position = action.payload
    const orderedArea = getOrderedAreaFromPositions(
      position,
      state.activeCellPosition
    )

    state.selectionArea = getEntireSuperArea(orderedArea, activeSheet.data)
  }

  return state
}

export const CELL_MOUSE_UP = (
  state: IExcelState,
  action: PayloadAction<ISelectionArea>
): IExcelState => {
  if (!state.isSelectionMode) return state

  state.isSelectionMode = false

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

export const CELL_DOUBLE_CLICK = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  state.isEditMode = true

  const cell = nSelectCell(activeSheet.data, state.activeCellPosition)

  state.editorState = createEditorStateFromCell(cell)

  return state
}

export const ROW_DRAG_ENTER = (
  state: IExcelState,
  action: PayloadAction<{
    dragRowOffset: IDragRowOffset
    dragRowIndex: IDragRowIndex
  }>
): IExcelState => {
  const { dragRowOffset, dragRowIndex } = action.payload
  state.dragRowOffset = dragRowOffset
  state.dragRowIndex = dragRowIndex
  return state
}

export const COLUMN_DRAG_ENTER = (
  state: IExcelState,
  action: PayloadAction<{
    dragColumnOffset: IDragColumnOffset
    dragColumnIndex: IDragColumnIndex
  }>
): IExcelState => {
  const { dragColumnIndex, dragColumnOffset } = action.payload
  state.dragColumnOffset = dragColumnOffset
  state.dragColumnIndex = dragColumnIndex
  return state
}

export const ROW_DRAG_LEAVE = (state: IExcelState): IExcelState => {
  state.isRowDrag = false
  delete state.dragRowOffset
  delete state.dragRowIndex

  return state
}

export const COLUMN_DRAG_LEAVE = (state: IExcelState): IExcelState => {
  state.isColumnDrag = false
  delete state.dragColumnOffset
  delete state.dragColumnIndex

  return state
}

export const ROW_DRAG_START = (state: IExcelState): IExcelState => {
  state.isRowDrag = true
  return state
}

export const ROW_DRAG_MOVE = (
  state: IExcelState,
  action: PayloadAction<IDragRowOffset>
): IExcelState => {
  state.dragRowOffset = action.payload
  return state
}

export const COLUMN_DRAG_MOVE = (
  state: IExcelState,
  action: PayloadAction<IDragColumnOffset>
): IExcelState => {
  state.dragColumnOffset = action.payload
  return state
}

export const COLUMN_DRAG_START = (state: IExcelState): IExcelState => {
  state.isColumnDrag = true
  return state
}

export const ROW_DRAG_END = (
  state: IExcelState,
  action: PayloadAction<IRowHeight>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  const dragRowIndex = state.dragRowIndex

  const height = action.payload

  if (height <= denormalizeRowHeight(1))
    activeSheet.hiddenRows[dragRowIndex] = true

  activeSheet.rowHeights[dragRowIndex] = height

  ROW_DRAG_LEAVE(state)
  return state
}

export const COLUMN_DRAG_END = (
  state: IExcelState,
  action: PayloadAction<IColumnWidth>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  const dragColumnIndex = state.dragColumnIndex

  const width = action.payload

  if (width <= denormalizeColumnWidth(1))
    activeSheet.hiddenColumns[dragColumnIndex] = true

  activeSheet.columnWidths[dragColumnIndex] = width

  COLUMN_DRAG_LEAVE(state)
  return state
}
