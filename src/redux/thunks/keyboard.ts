import { IAppThunk } from '../../@types/store'
import { selectIsEditMode, selectSelectionAreaIndex } from '../selectors/base'
import { ExcelActions } from '../store'
import {
  dispatchSaveActiveCell,
  getGeneralActionPayload,
} from '../tools/history'
import { computeInputPosition } from '../tools/offset'
import { getSheetContainer } from '../../tools'

export const THUNK_START_KEY_EDIT = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(ExcelActions.CELL_EDITOR_STATE_START(computeInputPosition(state)))
}

export const THUNK_KEY_ENTER = (): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(THUNK_START_KEY_EDIT())
  } else {
    dispatchSaveActiveCell(dispatch, state)
    dispatch(ExcelActions.CELL_EDITOR_STATE_END())

    const container = getSheetContainer()
    if (container) container.focus()
  }
}

export const THUNK_CELL_KEY_DELETE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  if (!selectIsEditMode(state))
    dispatch(ExcelActions.CELL_KEY_DELETE(getGeneralActionPayload(state)))
}
