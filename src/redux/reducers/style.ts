import { IExcelState } from '../../@types/state'
import { createFactoryReducerSetCellData } from '../tools/factory'
import {
  setFontUnderline,
  setFontItalic,
  setFontBold,
  setFontStrikeThrough,
} from '../tools/style'

export const SET_BOLD = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontBold)(state)

export const SET_ITALIC = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontItalic)(state)

export const SET_UNDERLINE = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontUnderline)(state)

export const SET_STRIKETHROUGH = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontStrikeThrough)(state)
