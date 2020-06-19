import { IExcelState, IEditorState } from '../../../@types/excel/state'
import { nSelectMergeCell, nSelectActiveSheet } from '../tools/selectors'
import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'

export const CELL_KEY_DOWN_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_DOWN = (state: IExcelState) => {
  const activeSheet = nSelectActiveSheet(state)
  if (activeSheet.activeCellPosition.y >= activeSheet.rowCount - 1) return state

  const mergeData = nSelectMergeCell(
    activeSheet.data,
    activeSheet.activeCellPosition
  )

  activeSheet.activeCellPosition.y = mergeData
    ? mergeData.end.y + 1
    : activeSheet.activeCellPosition.y + 1
  activeSheet.inactiveSelectionAreas = []
  activeSheet.selectionAreaIndex = -1
  activeSheet.selectionArea = undefined

  return state
}

export const CELL_KEY_UP_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_UP = (state: IExcelState) => {
  const activeSheet = nSelectActiveSheet(state)
  if (activeSheet.activeCellPosition.y < 2) return state

  const mergeData = nSelectMergeCell(
    activeSheet.data,
    activeSheet.activeCellPosition
  )

  activeSheet.activeCellPosition.y = mergeData
    ? mergeData.end.y - 1
    : activeSheet.activeCellPosition.y - 1
  activeSheet.inactiveSelectionAreas = []
  activeSheet.selectionAreaIndex = -1
  activeSheet.selectionArea = undefined

  return state
}

export const CELL_KEY_RIGHT_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_RIGHT = (state: IExcelState) => {
  const activeSheet = nSelectActiveSheet(state)
  if (activeSheet.activeCellPosition.x >= activeSheet.columnCount - 1)
    return state

  const mergeData = nSelectMergeCell(
    activeSheet.data,
    activeSheet.activeCellPosition
  )

  activeSheet.activeCellPosition.x = mergeData
    ? mergeData.end.x + 1
    : activeSheet.activeCellPosition.x + 1
  activeSheet.inactiveSelectionAreas = []
  activeSheet.selectionAreaIndex = -1
  activeSheet.selectionArea = undefined

  return state
}

export const CELL_KEY_LEFT_SHIFT = (state: IExcelState) => {
  return state
}

export const CELL_KEY_LEFT = (state: IExcelState) => {
  const activeSheet = nSelectActiveSheet(state)
  if (activeSheet.activeCellPosition.x < 2) return state

  const mergeData = nSelectMergeCell(
    activeSheet.data,
    activeSheet.activeCellPosition
  )

  activeSheet.activeCellPosition.x = mergeData
    ? mergeData.end.x - 1
    : activeSheet.activeCellPosition.x - 1
  activeSheet.inactiveSelectionAreas = []
  activeSheet.selectionAreaIndex = -1
  activeSheet.selectionArea = undefined

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
