import { IPosition, IRowCount, IColumnCount } from '../../../@types/excel/state'

export const checkIsCellPositionValid = (
  position: IPosition,
  columnCount: IColumnCount,
  rowCount: IRowCount
) =>
  position.x > 0 &&
  position.y > 0 &&
  columnCount &&
  columnCount >= position.x &&
  rowCount &&
  rowCount >= position.y
