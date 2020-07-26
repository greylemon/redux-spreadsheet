import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import { getGeneralActionPayload } from '../tools/history'

export const THUNK_MERGE_AREA = (): IAppThunk => (dispatch, getState) => {
  dispatch(ExcelActions.MERGE_AREA(getGeneralActionPayload(getState())))
}
