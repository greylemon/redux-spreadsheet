import { IExcelState, IEditorState } from '../../../@types/excel/state'
import { nSelectMergeCell } from '../tools/selectors'
import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'

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
  state.selectionArea = undefined

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
  state.selectionArea = undefined

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
  state.selectionArea = undefined

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
  state.selectionArea = undefined

  return state
}

export const CELL_EDITOR_STATE_UPDATE = (
  state: IExcelState,
  action: PayloadAction<IEditorState>
) => {
  const editorState = action.payload
  state.editorState = editorState
  return state
}

export const CELL_EDITOR_STATE_START = (state: IExcelState) => {
  state.isEditMode = true
  state.editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())
  return state
}
