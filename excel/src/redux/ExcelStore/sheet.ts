import { IExcelState, ISheetName } from '../../@types/excel/state'
import { PayloadAction } from '@reduxjs/toolkit'

// TODO
export const CHANGE_SHEET = (
  state: IExcelState,
  action: PayloadAction<ISheetName>
) => {
  const sheetName = action.payload
  if (
    state.activeSheeName === sheetName ||
    !Object.keys(state.inactiveSelectionAreas).includes(sheetName)
  )
    return state

  const newActiveSheetContents = state.inactiveSheets[sheetName]

  const activesheetContent = {
    ...state,
    inactiveSheets: undefined,
    sheetNames: undefined,
    activeSheetName: undefined,
  }

  state.inactiveSheets[state.activeSheeName] = activesheetContent
  state.activeSheeName = sheetName

  return state
}
