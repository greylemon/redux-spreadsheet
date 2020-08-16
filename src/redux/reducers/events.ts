import { PayloadAction } from '@reduxjs/toolkit'
import { IExcelState, IScrollOffset } from '../../@types/state'
import {
  IVerticalOffsetType,
  IHorizontalOffsetType,
} from '../../@types/general'
import { nSelectActiveSheet } from '../tools/selectors'

export const UPDATE_STATE = (
  state: IExcelState,
  action: PayloadAction<Partial<IExcelState>>
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

export const UPDATE_SCROLL_OFFSET_X = (
  state: IExcelState,
  action: PayloadAction<number>
): IExcelState => {
  state.scrollOffset.x = action.payload
  return state
}

export const UPDATE_SCROLL_OFFSET_Y = (
  state: IExcelState,
  action: PayloadAction<number>
): IExcelState => {
  state.scrollOffset.y = action.payload
  return state
}

export const SCROLL_DOWN = (state: IExcelState): IExcelState => {
  const { rowCount } = nSelectActiveSheet(state)
  state.topLeftPosition.y = Math.min(state.topLeftPosition.y + 1, rowCount)
  return state
}

export const SCROLL_UP = (state: IExcelState): IExcelState => {
  const { freezeRowCount } = nSelectActiveSheet(state)
  state.topLeftPosition.y = Math.max(
    state.topLeftPosition.y - 1,
    freezeRowCount + 1
  )
  return state
}

export const SCROLL_LEFT = (state: IExcelState): IExcelState => {
  const { freezeColumnCount } = nSelectActiveSheet(state)
  state.topLeftPosition.x = Math.max(
    state.topLeftPosition.x - 1,
    freezeColumnCount + 1
  )
  return state
}

export const SCROLL_RIGHT = (state: IExcelState): IExcelState => {
  const { columnCount } = nSelectActiveSheet(state)
  state.topLeftPosition.x = Math.min(state.topLeftPosition.x + 1, columnCount)
  return state
}

export const SCROLL_VERTICAL = (
  state: IExcelState,
  action: PayloadAction<number>
): IExcelState => {
  state.topLeftPosition.y = action.payload
  return state
}

export const SCROLL_HORIZONTAL = (
  state: IExcelState,
  action: PayloadAction<number>
): IExcelState => {
  state.topLeftPosition.x = action.payload
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
