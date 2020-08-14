import { PayloadAction } from '@reduxjs/toolkit'
import { EditorState, ContentState } from 'draft-js'
import {
  IExcelState,
  ICellEditorState,
  IPosition,
  ITitleEditorState,
} from '../../@types/state'
import {
  nSelectMergeCellArea,
  nSelectActiveSheet,
  nSelectActiveSheetData,
  nSelectActiveCell,
} from '../tools/selectors'
import { TYPE_MERGE } from '../../constants/types'
import { getFontBlockEditorState } from '../../tools/cell'
import { getCellMapSetFromState } from '../tools/area'
import { IGeneralActionPayload } from '../../@types/history'
import { deletePositions } from '../../tools/formula/formula'

export const UPDATE_TITLE_EDITOR_STATE = (
  state: IExcelState,
  action: PayloadAction<ITitleEditorState>
): IExcelState => {
  state.titleEditorState = action.payload
  return state
}

export const SAVE_TITLE_EDITOR_STATE = (state: IExcelState): IExcelState => {
  state.title = state.titleEditorState.getCurrentContent().getPlainText()
  return state
}

export const ESCAPE_TITLE_EDITOR_STATE = (state: IExcelState): IExcelState => {
  state.titleEditorState = EditorState.createWithContent(
    ContentState.createFromText(state.title)
  )
  return state
}

export const CELL_KEY_DOWN_SHIFT = (state: IExcelState): IExcelState => {
  return state
}

export const CELL_KEY_DOWN = (state: IExcelState): IExcelState => {
  const activeSheet = nSelectActiveSheet(state)
  if (state.isEditMode || state.activeCellPosition.y >= activeSheet.rowCount)
    return state

  const mergeData = nSelectMergeCellArea(state)

  state.activeCellPosition.y = Math.min(
    mergeData ? mergeData.end.y + 1 : state.activeCellPosition.y + 1,
    activeSheet.rowCount
  )
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

  const mergeData = nSelectMergeCellArea(state)

  state.activeCellPosition.y = Math.max(
    mergeData
      ? mergeData.start.y - 1
      : Math.max(state.activeCellPosition.y - 1, 1),
    1
  )
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

  const mergeData = nSelectMergeCellArea(state)

  state.activeCellPosition.x = Math.min(
    mergeData ? mergeData.end.x + 1 : state.activeCellPosition.x + 1,
    activeSheet.columnCount
  )
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

  const mergeData = nSelectMergeCellArea(state)

  state.activeCellPosition.x = Math.max(
    mergeData ? mergeData.start.x - 1 : state.activeCellPosition.x - 1,
    1
  )
  state.inactiveSelectionAreas = []
  state.selectionAreaIndex = -1
  state.selectionArea = undefined

  return state
}

export const CELL_EDITOR_STATE_UPDATE = (
  state: IExcelState,
  action: PayloadAction<ICellEditorState>
): IExcelState => {
  const editorState = action.payload
  state.cellEditorState = editorState
  return state
}

export const CELL_EDITOR_STATE_START = (
  state: IExcelState,
  action: PayloadAction<IPosition>
): IExcelState => {
  state.cellEditorOffset = action.payload
  state.isEditMode = true
  let editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())

  const activeCell = nSelectActiveCell(state)

  if (activeCell && activeCell.style && activeCell.style.font)
    editorState = getFontBlockEditorState(editorState, activeCell.style.font)

  state.cellEditorState = editorState

  return state
}

export const CELL_EDITOR_STATE_END = (state: IExcelState): IExcelState => {
  state.isEditMode = false
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

  const positionsToUpdate: IPosition[] = []

  Object.keys(cellMapSet).forEach((rowIndex) => {
    const columnIndices = cellMapSet[rowIndex]

    const row = data[rowIndex]

    if (row) {
      columnIndices.forEach((columnIndex) => {
        const cell = row[columnIndex]

        if (cell && cell.value !== undefined) {
          if (cell.type !== TYPE_MERGE) {
            delete cell.value
            delete cell.type
          }

          positionsToUpdate.push({ x: columnIndex, y: +rowIndex })
        }
      })
    }
  })

  deletePositions(
    state.activeSheetName,
    positionsToUpdate,
    state.sheetsMap,
    state.dependentReferences,
    state.independentDependentReferences,
    state.independentReferences,
    state.independentDependentReferences,
    state.sheetToIndependentDependentMap,
    state.results
  )

  return state
}
