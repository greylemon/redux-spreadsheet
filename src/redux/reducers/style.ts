import { IExcelState } from '../../@types/state'
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

export const SET_BOLD = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontBold)(state)

export const SET_ITALIC = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontItalic)(state)

export const SET_UNDERLINE = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontUnderline)(state)

export const SET_STRIKETHROUGH = (state: IExcelState): IExcelState =>
  createFactoryReducerSetCellData(setFontStrikeThrough)(state)

export const UNSET_BOLD = (state: IExcelState): IExcelState =>
  createFactoryReducerUnsetCellData(unsetFontBold)(state)

export const UNSET_ITALIC = (state: IExcelState): IExcelState =>
  createFactoryReducerUnsetCellData(unsetFontItalic)(state)

export const UNSET_UNDERLINE = (state: IExcelState): IExcelState =>
  createFactoryReducerUnsetCellData(unsetFontUnderline)(state)

export const UNSET_STRIKETHROUGH = (state: IExcelState): IExcelState =>
  createFactoryReducerUnsetCellData(unsetFontStrikeThrough)(state)
