import { IPosition } from '../../../@types/excel/state'

export const DEFAULT = {
  rowCount: 0,
  columnCount: 0,
  freezeRowCount: 0,
  freezeColumnCount: 0,

  minRowCount: 200,
  minColumnCount: 26,
  maxRowCount: 4000,
  maxColumnCount: 100,
  activeCellPosition: { x: 1, y: 1 } as IPosition,
}
