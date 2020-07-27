import { RichUtils, DraftInlineStyleType, EditorState } from 'draft-js'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  createFactoryReducerSetCellData,
  createFactoryReducerUnsetCellData,
} from '../tools/factory'
import {
  setFontUnderline,
  setFontItalic,
  setFontBold,
  setFontStrikeThrough,
  unsetFontBold,
  unsetFontItalic,
  unsetFontUnderline,
  unsetFontStrikeThrough,
} from '../tools/style'
import { IExcelState } from '../../@types/state'

export const SET_BOLD = createFactoryReducerSetCellData(setFontBold)

export const SET_ITALIC = createFactoryReducerSetCellData(setFontItalic)

export const SET_UNDERLINE = createFactoryReducerSetCellData(setFontUnderline)

export const SET_STRIKETHROUGH = createFactoryReducerSetCellData(
  setFontStrikeThrough
)

export const UNSET_BOLD = createFactoryReducerUnsetCellData(unsetFontBold)

export const UNSET_ITALIC = createFactoryReducerUnsetCellData(unsetFontItalic)

export const UNSET_UNDERLINE = createFactoryReducerUnsetCellData(
  unsetFontUnderline
)

export const UNSET_STRIKETHROUGH = createFactoryReducerUnsetCellData(
  unsetFontStrikeThrough
)

export const TOGGLE_EDITOR_STATE_STYLE = (
  state: IExcelState,
  action: PayloadAction<DraftInlineStyleType>
): IExcelState => {
  const selection = state.editorState.getSelection()

  state.editorState = EditorState.forceSelection(
    EditorState.moveFocusToEnd(
      RichUtils.toggleInlineStyle(state.editorState, action.payload)
    ),
    selection
  )

  return state
}
