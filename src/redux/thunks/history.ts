import { undo, redo } from 'undox'
import { IAppThunk } from '../../@types/store'
import { selectIsEditMode } from '../selectors/base'

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
