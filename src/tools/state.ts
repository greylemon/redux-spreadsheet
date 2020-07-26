import { IExcelState } from '../@types/state'
import { nSelectActiveCell } from '../redux/tools/selectors'
import { updateReferenceCell } from './formula'

export const updateActiveCellRef = (state: IExcelState): void => {
  const focusedCell = nSelectActiveCell(state)
  const focusedCellPosition = state.activeCellPosition
  const focusedSheetName = state.activeSheetName

  updateReferenceCell(
    state,
    {},
    focusedCell,
    focusedCellPosition,
    focusedSheetName
  )
}
