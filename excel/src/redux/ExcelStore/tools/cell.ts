import {
  IPosition,
  IRowCount,
  IColumnCount,
  ICell,
} from '../../../@types/excel/state'
import { EditorState, convertFromRaw } from 'draft-js'
import { getRawContentStateFromRichText } from './text'

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

export const createEditorStateFromCellValue = (cell?: ICell) => {
  let editorState: EditorState
  if (cell && cell.value) {
    editorState =
      typeof cell.value === 'object'
        ? EditorState.moveFocusToEnd(
            EditorState.createWithContent(
              convertFromRaw(getRawContentStateFromRichText(cell.value))
            )
          )
        : EditorState.moveFocusToEnd(EditorState.createEmpty())
  } else {
    editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())
  }

  return editorState
}
