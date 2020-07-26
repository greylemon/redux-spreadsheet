import { MutableRefObject } from 'react'
import { IAppThunk } from '../../@types/store'
import { selectIsEditMode, selectSelectionAreaIndex } from '../selectors/base'
import { ExcelActions } from '../store'
import {
  selectIsBold,
  selectIsUnderline,
  selectIsStrikeThrough,
  selectIsItalic,
} from '../selectors/style'

export const THUNK_KEY_ENTER = (
  gridRef: MutableRefObject<HTMLDivElement>
): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(ExcelActions.CELL_KEY_ENTER_EDIT_START())
  } else {
    dispatch(ExcelActions.CELL_KEY_ENTER_EDIT_END())
  }

  gridRef.current.focus()
}

export const THUNK_TOGGLE_BOLD = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isBold = selectIsBold(state)

  dispatch(isBold ? ExcelActions.UNSET_BOLD() : ExcelActions.SET_BOLD())
}

export const THUNK_TOGGLE_ITALIC = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isItalic = selectIsItalic(state)

  dispatch(isItalic ? ExcelActions.UNSET_ITALIC() : ExcelActions.SET_ITALIC())
}

export const THUNK_TOGGLE_STRIKETHROUGH = (): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()

  const isStrikethrough = selectIsStrikeThrough(state)

  dispatch(
    isStrikethrough
      ? ExcelActions.UNSET_STRIKETHROUGH()
      : ExcelActions.SET_STRIKETHROUGH()
  )
}

export const THUNK_TOGGLE_UNDERLINE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isUnderline = selectIsUnderline(state)

  dispatch(
    isUnderline ? ExcelActions.UNSET_UNDERLINE() : ExcelActions.SET_UNDERLINE()
  )
}
