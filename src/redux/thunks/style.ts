import { DraftInlineStyleType } from 'draft-js'
import { Selector } from '@reduxjs/toolkit'
import IRootStore, { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import {
  selectIsBold,
  selectIsUnderline,
  selectIsStrikeThrough,
  selectIsItalic,
} from '../selectors/style'
import { getGeneralActionPayload } from '../tools/history'
import { selectIsEditMode } from '../selectors/base'
import { IStyleReducer } from '../../@types/reducer'

export const TOGGLE_STYLE = (
  editorStateString: DraftInlineStyleType,
  styleSelctor: Selector<IRootStore, any>,
  toggleOnAction: IStyleReducer,
  toggleOffAction: IStyleReducer
): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const payload = getGeneralActionPayload(state)
  const isEditMode = selectIsEditMode(state)
  const isToggleOn = styleSelctor(state)

  if (isEditMode) {
    dispatch(ExcelActions.TOGGLE_EDITOR_STATE_STYLE(editorStateString))
  } else {
    dispatch(isToggleOn ? toggleOffAction(payload) : toggleOnAction(payload))
  }
}

export const THUNK_TOGGLE_BOLD = () =>
  TOGGLE_STYLE(
    'BOLD',
    selectIsBold,
    ExcelActions.SET_BOLD,
    ExcelActions.UNSET_BOLD
  )

export const THUNK_TOGGLE_ITALIC = () =>
  TOGGLE_STYLE(
    'ITALIC',
    selectIsItalic,
    ExcelActions.SET_ITALIC,
    ExcelActions.UNSET_ITALIC
  )

export const THUNK_TOGGLE_STRIKETHROUGH = () =>
  TOGGLE_STYLE(
    'STRIKETHROUGH',
    selectIsStrikeThrough,
    ExcelActions.SET_STRIKETHROUGH,
    ExcelActions.UNSET_STRIKETHROUGH
  )

export const THUNK_TOGGLE_UNDERLINE = () =>
  TOGGLE_STYLE(
    'UNDERLINE',
    selectIsUnderline,
    ExcelActions.SET_UNDERLINE,
    ExcelActions.UNSET_UNDERLINE
  )

export const THUNK_MERGE_AREA = (): IAppThunk => (dispatch, getState) => {
  dispatch(ExcelActions.MERGE_AREA(getGeneralActionPayload(getState())))
}
