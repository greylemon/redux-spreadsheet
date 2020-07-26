import { convertRawExcelToState } from '../../tools/IO'
import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import { IHandleSave } from '../../@types/functions'
import { selectExcel } from '../selectors/base'

export const THUNK_COMMAND_LOAD = (file: File): IAppThunk => (dispatch) => {
  convertRawExcelToState(file).then((content) => {
    dispatch(ExcelActions.UPDATE_STATE(content))
  })
}

export const THUNK_COMMAND_SAVE = (handleSave: IHandleSave): IAppThunk => (
  _,
  getState
) => {
  handleSave(selectExcel(getState()))
}
