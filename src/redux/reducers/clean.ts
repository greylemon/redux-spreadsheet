import { IExcelState } from '../../@types/state'

export const CLEAN_STATE = (state: IExcelState) => {
  delete state.dragColumnIndex
  delete state.dragColumnOffset
  delete state.dragRowIndex
  delete state.dragRowOffset
}
