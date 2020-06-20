import { IPosition, IRowCount, IColumnCount, ICell } from '../../@types/state'
import {
  createEmptyEditorState,
  createEditorStateFromNonEmptyValue,
} from './text'

export const changeActiveCell = (position: IPosition) => {
  return position
}

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

export const createEditorStateFromCell = (cell?: ICell) =>
  cell && cell.value
    ? createEditorStateFromNonEmptyValue(cell.value)
    : createEmptyEditorState()
