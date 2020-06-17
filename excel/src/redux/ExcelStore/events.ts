import { IExcelState } from '../../@types/excel/state'
import { PayloadAction } from '@reduxjs/toolkit'

export const UPDATE_STATE = (
  state: IExcelState,
  action: PayloadAction<IExcelState>
) => ({
  ...state,
  ...action.payload,
})
