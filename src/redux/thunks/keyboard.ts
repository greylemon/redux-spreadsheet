import { IAppThunk } from '../../@types/store'
import { selectIsEditMode, selectSelectionAreaIndex } from '../selectors/base'
import { ExcelActions } from '../store'
import { selectIsBold } from '../selectors/style'

export const THUNK_KEY_ENTER = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(ExcelActions.CELL_KEY_ENTER_EXIT())
  } else {
    dispatch(ExcelActions.CELL_KEY_ENTER())
  }
}

export const THUNK_TOGGLE_BOLD = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isBold = selectIsBold(state)

  dispatch(isBold ? ExcelActions.UNSET_BOLD() : ExcelActions.SET_BOLD())
}

export const THUNK_TOGGLE_ITALIC = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isBold = selectIsBold(state)

  dispatch(isBold ? ExcelActions.UNSET_ITALIC() : ExcelActions.UNSET_ITALIC())
}

export const THUNK_TOGGLE_STRIKETHROUGH = (): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()

  const isBold = selectIsBold(state)

  dispatch(
    isBold
      ? ExcelActions.UNSET_STRIKETHROUGH()
      : ExcelActions.UNSET_STRIKETHROUGH()
  )
}

export const THUNK_TOGGLE_UNDERLINE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isBold = selectIsBold(state)

  dispatch(
    isBold ? ExcelActions.UNSET_UNDERLINE() : ExcelActions.SET_UNDERLINE()
  )
}
