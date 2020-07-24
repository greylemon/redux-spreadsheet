import { undo, redo } from 'undox'
import { IAppThunk } from '../../@types/store'
import { selectIsEditMode } from '../selectors/base'

export const THUNK_HISTORY_REDO = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(redo())
}

export const THUNK_HISTORY_UNDO = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(undo())
}
