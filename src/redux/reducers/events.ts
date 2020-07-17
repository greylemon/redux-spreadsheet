import { IExcelState, IScrollOffset } from '../../@types/state'
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
