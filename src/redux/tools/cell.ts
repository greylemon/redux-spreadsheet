import { IPosition, IRowCount, IColumnCount, ICell } from '../../@types/state'
import {
  createEmptyEditorState,
  createEditorStateFromNonEmptyValue,
} from './text'
import { EditorState } from 'draft-js'

export const changeActiveCell = (position: IPosition): IPosition => {
  return position
}

export const checkIsCellPositionValid = (
  position: IPosition,
  columnCount: IColumnCount,
  rowCount: IRowCount
): boolean =>
  position.x > 0 &&
  position.y > 0 &&
  columnCount > 0 &&
  columnCount >= position.x &&
  rowCount > 0 &&
  rowCount >= position.y

export const createEditorStateFromCell = (cell?: ICell): EditorState =>
  cell && cell.value
    ? createEditorStateFromNonEmptyValue(cell.value)
    : createEmptyEditorState()
