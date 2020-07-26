import { Dispatch } from '@reduxjs/toolkit'
import {
  selectActiveCellPosition,
  selectInactiveSelectionAreas,
  selectEditorState,
} from '../selectors/base'
import IRootStore from '../../@types/store'
import { IStyleActionPayload } from '../../@types/history'
import { ExcelActions } from '../store'
import { selectCell } from '../selectors/activeSheet'
import { createValueFromCellAndEditorState } from '../../tools/text'

export const getStyleActionPayload = (
  state: IRootStore
): IStyleActionPayload => ({
  activeCellPosition: selectActiveCellPosition(state),
  inactiveSelectionAreas: selectInactiveSelectionAreas(state),
})

export const dispatchSaveActiveCell = (dispatch: Dispatch, state: IRootStore) =>
  dispatch(
    ExcelActions.SAVE_ACTIVE_CELL({
      cell: createValueFromCellAndEditorState(
        selectCell(state),
        selectEditorState(state)
      ),
      inactiveSelectionAreas: selectInactiveSelectionAreas(state),
      activeCellPosition: selectActiveCellPosition(state),
    })
  )
