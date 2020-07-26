import { IExcelState, IArea } from '../../@types/state'
import { getCellMapSetFromAreas } from '../../tools/area'
import { ICellMapSet } from '../../@types/objects'
import { nSelectMergeCell } from './selectors'

export const getCellMapSetFromState = (state: IExcelState): ICellMapSet => {
  const { inactiveSelectionAreas } = state
  const { selectionArea } = state
  const { activeCellPosition } = state

  const merged = nSelectMergeCell(state)

  const combinedArea: IArea[] = [
    ...inactiveSelectionAreas,
    merged || { start: activeCellPosition, end: activeCellPosition },
  ]

  if (selectionArea) combinedArea.push(selectionArea)

  return getCellMapSetFromAreas(combinedArea)
}
