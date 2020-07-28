import { Dispatch } from '@reduxjs/toolkit'
import {
  selectActiveCellPosition,
  selectInactiveSelectionAreas,
  selectEditorState,
} from '../selectors/base'
import IRootStore from '../../@types/store'
import { IGeneralActionPayload } from '../../@types/history'
import { ExcelActions } from '../store'
import { selectCell, selectData } from '../selectors/activeSheet'
import { createValueFromCellAndEditorState } from '../../tools/text'
import { isCellEqualOtherCell } from './compare'

export const getGeneralActionPayload = (
  state: IRootStore
): IGeneralActionPayload => ({
  activeCellPosition: selectActiveCellPosition(state),
  inactiveSelectionAreas: selectInactiveSelectionAreas(state),
})

export const dispatchSaveActiveCell = (
  dispatch: Dispatch,
  state: IRootStore
) => {
  const newCell = createValueFromCellAndEditorState(
    selectData(state),
    selectCell(state),
    selectEditorState(state)
  )

  if (!isCellEqualOtherCell(newCell, selectCell(state)))
    dispatch(
      ExcelActions.SAVE_ACTIVE_CELL({
        cell: newCell,
        inactiveSelectionAreas: selectInactiveSelectionAreas(state),
        activeCellPosition: selectActiveCellPosition(state),
      })
    )
}
