import { IExcelState } from '../../../@types/state'
import { nSelectActiveSheet } from '../../tools/selectors'

export const SELECT_ALL = (state: IExcelState): IExcelState => {
  const { columnCount, rowCount } = nSelectActiveSheet(state)

  state.inactiveSelectionAreas = [
    {
      start: { x: 1, y: 1 },
      end: { x: columnCount, y: rowCount },
    },
  ]

  state.selectionAreaIndex = 0

  return state
}
