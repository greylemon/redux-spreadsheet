import { factorySetFontStyle, unsetFontStyleFactory } from './factory'
import {
  setStrikethroughStyle,
  setUnderlineStyle,
  setBoldStyle,
  setItalicStyle,
  unsetStrikethroughStyle,
  unsetUnderlineStyle,
  unsetBoldStyle,
  unsetItalicStyle,
} from '../../tools/style'

export const setFontStrikeThrough = factorySetFontStyle(setStrikethroughStyle)
export const setFontUnderline = factorySetFontStyle(setUnderlineStyle)
export const setFontBold = factorySetFontStyle(setBoldStyle)
export const setFontItalic = factorySetFontStyle(setItalicStyle)

export const unsetFontStrikeThrough = unsetFontStyleFactory(
  unsetStrikethroughStyle
)
export const unsetFontUnderline = unsetFontStyleFactory(unsetUnderlineStyle)
export const unsetFontBold = unsetFontStyleFactory(unsetBoldStyle)
export const unsetFontItalic = unsetFontStyleFactory(unsetItalicStyle)
