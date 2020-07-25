import { IExcelState, IArea } from '../../@types/state'
import { getCellMapSetFromAreas } from '../../tools'
import { ICellMapSet } from '../../@types/objects'

export const getCellMapSetFromState = (state: IExcelState): ICellMapSet => {
  const inactiveSelectionAreas = state.inactiveSelectionAreas
  const selectionArea = state.selectionArea
  const activeCellPosition = state.activeCellPosition

  const combinedArea: IArea[] = [
    ...inactiveSelectionAreas,
    { start: activeCellPosition, end: activeCellPosition },
  ]

  if (selectionArea) combinedArea.push(selectionArea)

  return getCellMapSetFromAreas(combinedArea)
}
