import { factorySetFontStyle } from './factory'
import {
  setStrikethroughStyle,
  setUnderlineStyle,
  setBoldStyle,
  setItalicStyle,
} from '../../tools/style'

export const setFontStrikeThrough = factorySetFontStyle(setStrikethroughStyle)
export const setFontUnderline = factorySetFontStyle(setUnderlineStyle)
export const setFontBold = factorySetFontStyle(setBoldStyle)
export const setFontItalic = factorySetFontStyle(setItalicStyle)
