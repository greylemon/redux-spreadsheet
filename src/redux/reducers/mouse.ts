import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'
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
import { createEditorStateFromCell } from '../../tools/cell'
import {
  getOrderedAreaFromPositions,
  getAndAddArea,
  getMinPositionFromArea,
  checkIsAreaEqualPosition,
  checkIsPositionEqualOtherPosition,
  getAreaFromPosition,
  checkIsAreaEqualOtherArea,
} from '../../tools/area'
import {
  nSelectActiveSheet,
  nSelectActiveCell,
  nSelectMergeCellArea,
  nSelectPosition,
} from '../tools/selectors'
import {
  denormalizeRowHeight,
  denormalizeColumnWidth,
} from '../../tools/dimensions'
import { updateActiveCellValueInPlace } from '../tools/cell'
import { TYPE_TEXT } from '../../constants/types'
import { IGeneralActionPayload } from '../../@types/history'

export const CELL_MOUSE_DOWN_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const position = action.payload

  if (!checkIsPositionEqualOtherPosition(state.activeCellPosition, position)) {
    if (!state.inactiveSelectionAreas.length) {
      state.inactiveSelectionAreas = [
        getAreaFromPosition(state.activeCellPosition),
      ]
    }
  }

  state.selectionAreaIndex = state.inactiveSelectionAreas.length

  state.selectionArea = { start: position, end: position }

  state.activeCellPosition = position
  state.isEditMode = false
  state.isSelectionMode = true
  state.lastVisitedCell = position

  return state
}

export const CELL_MOUSE_DOWN_SHIFT = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  const position = action.payload

  const orderedArea = getOrderedAreaFromPositions(
    position,
    state.activeCellPosition
  )

  state.isSelectionMode = true
  state.selectionArea = getEntireSuperArea(orderedArea, activeSheet.data)
  state.selectionAreaIndex = 0
  state.inactiveSelectionAreas = []
  state.isEditMode = false
  state.lastVisitedCell = position

  return state
}

export const CELL_MOUSE_DOWN = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const position = action.payload

  if (
    state.isEditMode &&
    !checkIsPositionEqualOtherPosition(nSelectPosition(state), position)
  ) {
    updateActiveCellValueInPlace(state)
  }

  state.inactiveSelectionAreas = []
  state.isEditMode = false
  state.isSelectionMode = true

  state.activeCellPosition = position
  state.activeCellPosition = nSelectPosition(state)

  const merged = nSelectMergeCellArea(state)

  if (merged) {
    state.selectionArea = merged
  } else {
    state.selectionArea = { start: position, end: position }
  }

  state.lastVisitedCell = position

  return state
}

export const CELL_MOUSE_ENTER = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)

  const position = action.payload

  state.selectionArea = getEntireSuperArea(
    { start: state.activeCellPosition, end: position },
    activeSheet.data
  )

  state.inactiveSelectionAreas = []

  state.lastVisitedCell = position

  return state
}

export const CELL_MOUSE_ENTER_CTRL = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)

  const position = action.payload

  state.selectionArea = getEntireSuperArea(
    { start: state.activeCellPosition, end: position },
    activeSheet.data
  )

  state.lastVisitedCell = position

  return state
}

export const CELL_MOUSE_UP = (
  state: IExcelState,
  action: PayloadAction<ISelectionArea>
): IExcelState => {
  state.isSelectionMode = false

  delete state.lastVisitedCell

  const selectionArea = action.payload

  if (selectionArea) {
    // TODO : Consider merged cells
    const { newAreas, superAreaIndex } = getAndAddArea(
      selectionArea,
      state.inactiveSelectionAreas
    )

    if (
      state.inactiveSelectionAreas.length > 0 ||
      (state.inactiveSelectionAreas.length === 1 &&
        !checkIsAreaEqualPosition(state.inactiveSelectionAreas[0])) ||
      !checkIsAreaEqualPosition(selectionArea)
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
        const merged = nSelectMergeCellArea(state)
        if (
          merged &&
          state.inactiveSelectionAreas.length === 1 &&
          checkIsAreaEqualOtherArea(merged, state.inactiveSelectionAreas[0])
        )
          state.inactiveSelectionAreas = []

        state.selectionAreaIndex = state.inactiveSelectionAreas.length - 1
      }
    } else {
      state.selectionAreaIndex = -1
    }
  }

  state.selectionArea = undefined

  return state
}

export const CELL_DOUBLE_CLICK = (state: IExcelState): IExcelState => {
  state.isEditMode = true

  const cell = nSelectActiveCell(state)

  let editorState = createEditorStateFromCell(cell)

  if (
    (cell &&
      (cell.type !== TYPE_TEXT ||
        (cell.value !== undefined && (cell.value as string).length))) ||
    cell === undefined
  )
    editorState = EditorState.moveFocusToEnd(editorState)

  state.editorState = editorState

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
  delete state.dragRowOffset
  delete state.dragRowIndex

  return state
}

export const COLUMN_DRAG_LEAVE = (state: IExcelState): IExcelState => {
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
  action: PayloadAction<
    { height: IRowHeight; dragRowIndex: IDragRowIndex } & IGeneralActionPayload
  >
): IExcelState => {
  const {
    dragRowIndex,
    height,
    activeCellPosition,
    inactiveSelectionAreas,
  } = action.payload

  state.activeCellPosition = activeCellPosition
  state.inactiveSelectionAreas = inactiveSelectionAreas

  const activeSheet = nSelectActiveSheet(state)

  if (height <= denormalizeRowHeight(9))
    activeSheet.hiddenRows[dragRowIndex] = true

  activeSheet.rowHeights[dragRowIndex] = height

  state.isRowDrag = false
  return state
}

export const COLUMN_DRAG_END = (
  state: IExcelState,
  action: PayloadAction<
    {
      dragColumnIndex: IDragColumnIndex
      width: IColumnWidth
    } & IGeneralActionPayload
  >
): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)

  const {
    dragColumnIndex,
    width,
    activeCellPosition,
    inactiveSelectionAreas,
  } = action.payload

  state.activeCellPosition = activeCellPosition
  state.inactiveSelectionAreas = inactiveSelectionAreas

  if (width <= denormalizeColumnWidth(9))
    activeSheet.hiddenColumns[dragColumnIndex] = true

  activeSheet.columnWidths[dragColumnIndex] = width

  state.isColumnDrag = false
  return state
}
