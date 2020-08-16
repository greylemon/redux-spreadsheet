import { IExcelState } from '../../@types/state'
import { createInitialExcelState } from '../tools/state'

export const CLEAN_STATE = (state: IExcelState) => {
  delete state.dragColumnIndex
  delete state.dragColumnOffset
  delete state.dragRowIndex
  delete state.dragRowOffset
}

export const CLEAR_STATE = () => createInitialExcelState()
