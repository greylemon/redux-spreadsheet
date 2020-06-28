import { IExcelState, ISheetName } from '../../@types/state'
import { PayloadAction } from '@reduxjs/toolkit'

export const CHANGE_SHEET_ORDER = (
  state: IExcelState,
  action: PayloadAction<{ oldIndex: number; newIndex: number }>
): IExcelState => {
  const { oldIndex, newIndex } = action.payload

  const sheetName = state.sheetNames[oldIndex]

  const newSheetNames = state.sheetNames.filter((name) => name !== sheetName)

  newSheetNames.splice(newIndex, 0, sheetName)

  state.sheetNames = newSheetNames

  return state
}

export const CHANGE_SHEET = (
  state: IExcelState,
  action: PayloadAction<ISheetName>
): IExcelState => {
  const sheetName = action.payload

  state.activeSheetName = sheetName

  return state
}
