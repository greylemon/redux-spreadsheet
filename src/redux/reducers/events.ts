import { IExcelState } from '../../@types/state'
import { PayloadAction } from '@reduxjs/toolkit'

export const UPDATE_STATE = (
  state: IExcelState,
  action: PayloadAction<IExcelState>
): IExcelState => ({
  ...state,
  ...action.payload,
})
