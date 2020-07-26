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
