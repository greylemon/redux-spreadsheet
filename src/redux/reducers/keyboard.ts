import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState } from 'draft-js'
import {
  IExcelState,
  IEditorState,
  IInactiveSelectionAreas,
  ICell,
  IPosition,
} from '../../@types/state'
import {
  nSelectMergeCell,
  nSelectActiveSheet,
  nSelectActiveSheetData,
  nSelectActiveCell,
} from '../tools/selectors'
import { TYPE_TEXT, TYPE_MERGE } from '../../constants/types'
import {
  createEditorStateFromCell,
  getFontBlockEditorState,
} from '../../tools/cell'
import { getCellMapSetFromState } from '../tools/area'
import { updateReferenceCell } from '../../tools/formula'
import { updateActiveCellRef } from '../../tools/state'
import { IGeneralActionPayload } from '../../@types/history'

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
  let editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())

  const activeCell = nSelectActiveCell(state)

  if (activeCell && activeCell.style && activeCell.style.font)
    editorState = getFontBlockEditorState(editorState, activeCell.style.font)

  state.editorState = editorState

  return state
}

export const CELL_KEY_DELETE = (
  state: IExcelState,
  action: PayloadAction<IGeneralActionPayload>
): IExcelState => {
  const { activeCellPosition, inactiveSelectionAreas } = action.payload
  state.activeCellPosition = activeCellPosition
  state.inactiveSelectionAreas = inactiveSelectionAreas

  const cellMapSet = getCellMapSetFromState(state)
  const data = nSelectActiveSheetData(state)

  Object.keys(cellMapSet).forEach((rowIndex) => {
    const columnIndices = cellMapSet[rowIndex]

    const row = data[rowIndex]

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
            { x: columnIndex, y: +rowIndex },
            state.activeSheetName
          )
        }
      })
    }
  })

  return state
}

export const SAVE_ACTIVE_CELL = (
  state: IExcelState,
  action: PayloadAction<{
    cell: ICell
    inactiveSelectionAreas: IInactiveSelectionAreas
    activeCellPosition: IPosition
  }>
): IExcelState => {
  const { activeCellPosition, cell, inactiveSelectionAreas } = action.payload
  state.activeCellPosition = activeCellPosition
  state.inactiveSelectionAreas = inactiveSelectionAreas
  state.isEditMode = false

  const activeSheet = nSelectActiveSheet(state)
  const { x, y } = activeCellPosition

  if (!activeSheet.data[y]) activeSheet.data[y] = {}
  if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

  activeSheet.data[y][x] = cell

  updateActiveCellRef(state)

  return state
}

export const CELL_KEY_ENTER_EDIT_START = (state: IExcelState): IExcelState => {
  state.isEditMode = true
  const cell = nSelectActiveCell(state)

  state.editorState = createEditorStateFromCell(cell, true)
  return state
}
