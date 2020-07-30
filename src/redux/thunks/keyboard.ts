import { IAppThunk } from '../../@types/store'
import { selectIsEditMode, selectSelectionAreaIndex } from '../selectors/base'
import { ExcelActions } from '../store'
import {
  dispatchSaveActiveCell,
  getGeneralActionPayload,
} from '../tools/history'
import { ISheetRef } from '../../@types/ref'

export const THUNK_KEY_ENTER = (sheetRef: ISheetRef): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(ExcelActions.CELL_KEY_ENTER_EDIT_START())
  } else {
    dispatchSaveActiveCell(dispatch, getState())
  }

  sheetRef.current.focus()
}

export const THUNK_CELL_KEY_DELETE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  if (!selectIsEditMode(state))
    dispatch(ExcelActions.CELL_KEY_DELETE(getGeneralActionPayload(state)))
}
