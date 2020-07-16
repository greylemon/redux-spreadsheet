import { convertRawExcelToState } from '../tools/parser'
import { IAppThunk } from '../@types/store'
import { ExcelActions } from './store'
import { IHandleSave } from '../@types/functions'
import { selectExcel, selectIsEditMode, selectSelectionArea } from './selectors'
import { undo, redo } from 'undox'

export const loadWorkbook = (file: File): IAppThunk => (dispatch) => {
  convertRawExcelToState(file).then((content) => {
    dispatch(ExcelActions.UPDATE_STATE(content))
  })
}

export const saveWorkbook = (handleSave: IHandleSave): IAppThunk => (
  _,
  getState
) => {
  handleSave(selectExcel(getState()))
}

export const customRedo = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(redo())
}

export const customUndo = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(undo())
}

export const customMouseUp = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const selectionArea = selectSelectionArea(state)

  if (selectionArea) dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
}
