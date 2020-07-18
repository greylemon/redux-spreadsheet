import { IExcelState, IScrollOffset, IPosition } from '../../@types/state'
import { PayloadAction } from '@reduxjs/toolkit'

export const UPDATE_STATE = (
  state: IExcelState,
  action: PayloadAction<IExcelState>
): IExcelState => ({
  ...state,
  ...action.payload,
})

export const UPDATE_SCROLL_OFFSET = (
  state: IExcelState,
  action: PayloadAction<IScrollOffset>
): IExcelState => {
  state.scrollOffset = action.payload
  return state
}

export const UPDATE_SHEET_DIMENSIONS = (
  state: IExcelState,
  action: PayloadAction<IPosition>
) => {
  state.sheetDimensions = action.payload
  return state
}
