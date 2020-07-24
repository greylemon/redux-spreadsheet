import { IAppThunk } from '../../@types/store'
import { selectIsEditMode, selectSelectionAreaIndex } from '../selectors/base'
import { ExcelActions } from '../store'

export const customEnter = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(ExcelActions.CELL_KEY_ENTER_EXIT())
  } else {
    dispatch(ExcelActions.CELL_KEY_ENTER())
  }
}
