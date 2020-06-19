import { IExcelState, ISheetName } from '../../@types/excel/state'
import { PayloadAction } from '@reduxjs/toolkit'

export const CHANGE_SHEET_ORDER = (
  state: IExcelState,
  action: PayloadAction<{ oldIndex: number; newIndex: number }>
) => {
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
) => {
  const sheetName = action.payload
  if (state.activeSheetName === sheetName) return state

  state.activeSheetName = sheetName

  return state
}
