import { PayloadAction } from '@reduxjs/toolkit'
import {
  IExcelState,
  IInactiveSelectionAreas,
  ICell,
  IPosition,
} from '../../@types/state'
import { nSelectActiveSheet } from '../tools/selectors'
import { updateActiveCellRef } from '../../tools/formula/formula'

export const SAVE_ACTIVE_CELL = (
  state: IExcelState,
  action: PayloadAction<{
    cell: ICell
    inactiveSelectionAreas: IInactiveSelectionAreas
    activeCellPosition: IPosition
  }>
): IExcelState => {
  const { activeCellPosition, cell, inactiveSelectionAreas } = action.payload
  state.activeCellPosition = activeCellPosition
  state.inactiveSelectionAreas = inactiveSelectionAreas
  state.isEditMode = false

  const activeSheet = nSelectActiveSheet(state)
  const { x, y } = activeCellPosition

  if (!activeSheet.data[y]) activeSheet.data[y] = {}
  if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

  activeSheet.data[y][x] = cell

  updateActiveCellRef(
    state.activeSheetName,
    state.activeCellPosition,
    state.sheetsMap,
    state.dependentReferences,
    state.independentReferences,
    state.results
  )

  return state
}
