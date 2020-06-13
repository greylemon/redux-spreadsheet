import {
  IPosition,
  IRowCount,
  IColumnCount,
  ICell,
} from '../../../@types/excel/state'
import { EditorState, convertFromRaw, ContentState } from 'draft-js'
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
    const value = cell.value
    editorState =
      typeof value === 'object'
        ? EditorState.moveFocusToEnd(
            EditorState.createWithContent(
              convertFromRaw(getRawContentStateFromRichText(value))
            )
          )
        : EditorState.moveFocusToEnd(
            EditorState.createWithContent(ContentState.createFromText(value))
          )
  } else {
    editorState = EditorState.moveFocusToEnd(EditorState.createEmpty())
  }

  return editorState
}
