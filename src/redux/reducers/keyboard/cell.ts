import { IExcelState, IEditorState } from '../../../@types/state'
import { nSelectMergeCell, nSelectActiveSheet } from '../../tools/selectors'
import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'
import { getCellMapSetFromAreas } from '../../../tools/area'

export const CELL_KEY_DOWN_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_DOWN = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.activeCellPosition.y >= activeSheet.rowCount) return state

  const mergeData = nSelectMergeCell(activeSheet.data, state.activeCellPosition)

  state.activeCellPosition.y = mergeData
    ? mergeData.end.y + 1
    : state.activeCellPosition.y + 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1
  state.selectionArea = undefined

  return state
}

export const CELL_KEY_UP_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_UP = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.activeCellPosition.y < 2) return state

  const mergeData = nSelectMergeCell(activeSheet.data, state.activeCellPosition)

  state.activeCellPosition.y = mergeData
    ? mergeData.end.y - 1
    : state.activeCellPosition.y - 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1
  state.selectionArea = undefined

  return state
}

export const CELL_KEY_RIGHT_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_RIGHT = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.activeCellPosition.x >= activeSheet.columnCount) return state

  const mergeData = nSelectMergeCell(activeSheet.data, state.activeCellPosition)

  state.activeCellPosition.x = mergeData
    ? mergeData.end.x + 1
    : state.activeCellPosition.x + 1
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1
  state.selectionArea = undefined

  return state
}

export const CELL_KEY_LEFT_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_LEFT = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.activeCellPosition.x < 2) return state

  const mergeData = nSelectMergeCell(activeSheet.data, state.activeCellPosition)

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
): IExcelState => {
  const editorState = action.payload
  state.editorState = editorState
  return state
}

export const CELL_EDITOR_STATE_START = (state: IExcelState): IExcelState => {
  state.isEditMode = true
  state.editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())
  return state
}

export const CELL_KEY_DELETE = (state: IExcelState): IExcelState => {
  // const activeCell = state.activeCellPosition
  // const cellMapSet = getCellMapSetFromAreas([ ...state.inactiveSelectionAreas, { start: activeCell, end: activeCell } ])

  // for (let rowIndex in cellMapSet) {

  // }

  return state
}
