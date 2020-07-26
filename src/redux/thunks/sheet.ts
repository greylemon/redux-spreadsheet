import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import { selectSheetNameText, selectSheetNames } from '../selectors/base'
import { generateNewSheetName } from '../../tools/sheet'

export const THUNK_RENAME_SHEET = (): IAppThunk => (dispatch, getState) => {
  const sheetNameText = selectSheetNameText(getState())
  dispatch(ExcelActions.CHANGE_ACTIVE_SHEET_NAME(sheetNameText))
}

export const THUNK_ADD_SHEET = (): IAppThunk => (dispatch, getState) => {
  const newSheetName = generateNewSheetName(selectSheetNames(getState()))

  dispatch(ExcelActions.ADD_SHEET(newSheetName))
}
