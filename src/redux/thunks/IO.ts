import { convertRawExcelToState } from '../../tools/parser'
import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import { IHandleSave } from '../../@types/functions'
import { selectExcel } from '../selectors/base'

export const loadWorkbook = (file: File): IAppThunk => (dispatch) => {
  convertRawExcelToState(file).then((content) => {
    dispatch(ExcelActions.UPDATE_STATE(content))
  })
}

export const saveWorkbook = (handleSave: IHandleSave): IAppThunk => (
  _,
  getState
) => {
  handleSave(selectExcel(getState()))
}
