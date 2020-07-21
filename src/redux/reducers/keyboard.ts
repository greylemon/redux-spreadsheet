import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'
import { IExcelState, IEditorState } from '../../@types/state'
import {
  nSelectMergeCell,
  nSelectActiveSheet,
  nSelectActiveSheetData,
} from '../tools/selectors'
import { getCellMapSetFromAreas } from '../../tools/area'
import { TYPE_TEXT, TYPE_MERGE } from '../../constants/types'
import { updateReferenceCell } from '../../tools'

export const CELL_KEY_DOWN_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_DOWN = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.isEditMode || state.activeCellPosition.y >= activeSheet.rowCount)
    return state

  const mergeData = nSelectMergeCell(state)

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
  if (state.isEditMode || state.activeCellPosition.y < 2) return state

  const mergeData = nSelectMergeCell(state)

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
  if (state.isEditMode || state.activeCellPosition.x >= activeSheet.columnCount)
    return state

  const mergeData = nSelectMergeCell(state)

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
  if (state.isEditMode || state.activeCellPosition.x < 2) return state

  const mergeData = nSelectMergeCell(state)

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
  if (state.isEditMode) return state

  state.isEditMode = true
  state.editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())
  return state
}

export const CELL_KEY_DELETE = (state: IExcelState): IExcelState => {
  if (state.isEditMode) return state

  const activeCell = state.activeCellPosition
  const cellMapSet = getCellMapSetFromAreas([
    ...state.inactiveSelectionAreas,
    { start: activeCell, end: activeCell },
  ])
  const data = nSelectActiveSheetData(state)

  for (const rowIndex in cellMapSet) {
    const columnIndices = cellMapSet[rowIndex]

    const row = data[+rowIndex]

    if (row) {
      columnIndices.forEach((columnIndex) => {
        const cell = row[columnIndex]

        if (cell) {
          if (cell.type !== TYPE_MERGE) {
            cell.type = TYPE_TEXT
            delete cell.value
          }

          updateReferenceCell(
            state,
            {},
            cell,
            { x: +columnIndex, y: +rowIndex },
            state.activeSheetName
          )
        }
      })
    }
  }

  return state
}
