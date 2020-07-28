import { PayloadAction } from '@reduxjs/toolkit'
import {
  IExcelState,
  IInactiveSelectionAreas,
  ICell,
  IPosition,
} from '../../@types/state'
import { nSelectActiveSheet, nSelectMergeCellArea } from '../tools/selectors'
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

  state.inactiveSelectionAreas = inactiveSelectionAreas
  state.isEditMode = false

  const activeSheet = nSelectActiveSheet(state)

  const area = nSelectMergeCellArea(state)

  const finalPosition = area ? area.start : activeCellPosition
  state.activeCellPosition = finalPosition
  const { x, y } = finalPosition

  if (!activeSheet.data[y]) activeSheet.data[y] = {}
  if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

  activeSheet.data[y][x] = cell

  updateActiveCellRef(
    state.activeSheetName,
    finalPosition,
    state.sheetsMap,
    state.dependentReferences,
    state.independentReferences,
    state.results
  )

  return state
}
