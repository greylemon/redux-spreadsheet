import { convertRawExcelToState } from '../tools/parser'
import { ThunkAction } from 'redux-thunk'
import IRootStore from '../@types/store'
import { Action } from 'redux'
import { ExcelActions } from './store'

export const loadWorkbook = (
  file: File
): ThunkAction<void, IRootStore, unknown, Action<string>> => (dispatch) => {
  convertRawExcelToState(file).then((content) => {
    dispatch(ExcelActions.UPDATE_STATE(content as any))
  })
}
