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
import { getStyleActionPayload, dispatchSaveActiveCell } from '../tools/history'

export const THUNK_KEY_ENTER = (
  gridRef: MutableRefObject<HTMLDivElement>
): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(ExcelActions.CELL_KEY_ENTER_EDIT_START())
  } else {
    dispatchSaveActiveCell(dispatch, getState())
  }

  gridRef.current.focus()
}

export const THUNK_TOGGLE_BOLD = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isBold = selectIsBold(state)

  const payload = getStyleActionPayload(getState())

  dispatch(
    isBold ? ExcelActions.UNSET_BOLD(payload) : ExcelActions.SET_BOLD(payload)
  )
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
