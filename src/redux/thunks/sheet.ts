import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import { selectSheetNameText } from '../selectors/base'

export const THUNK_RENAME_SHEET = (): IAppThunk => (dispatch, getState) => {
  const sheetNameText = selectSheetNameText(getState())
  dispatch(ExcelActions.CHANGE_ACTIVE_SHEET_NAME(sheetNameText))
}
