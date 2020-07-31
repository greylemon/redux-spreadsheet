import { PayloadAction } from '@reduxjs/toolkit'
import { IExcelState, IScrollOffset, IPosition } from '../../@types/state'
import {
  IVerticalOffsetType,
  IHorizontalOffsetType,
} from '../../@types/general'

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
): IExcelState => {
  state.sheetDimensions = action.payload
  return state
}

export const UPDATE_SCROLL_EVENT = (
  state: IExcelState,
  action: PayloadAction<{
    scrollVertical: IVerticalOffsetType
    scrollHorizontal: IHorizontalOffsetType
  }>
): IExcelState => {
  const { scrollHorizontal, scrollVertical } = action.payload

  state.scrollHorizontal = scrollHorizontal
  state.scrollVertical = scrollVertical

  return state
}
