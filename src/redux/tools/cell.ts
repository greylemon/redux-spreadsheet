import {
  IPosition,
  IRowCount,
  IColumnCount,
  ICell,
  IRichTextValue,
} from '../../@types/state'
import {
  createEmptyEditorState,
  createEditorStateFromText,
  createEditorStateFromRichText,
} from './text'
import { EditorState } from 'draft-js'
import {
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_RICH_TEXT,
  TYPE_NUMBER,
} from '../../constants/cellTypes'

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

export const createEditorStateFromCell = (cell?: ICell): EditorState => {
  let editorState: EditorState | null = null

  if (cell && cell.value) {
    switch (cell.type) {
      case TYPE_FORMULA:
        editorState = createEditorStateFromText(`=${cell.value}`)
        break
      case TYPE_RICH_TEXT:
        editorState = createEditorStateFromRichText(
          cell.value as IRichTextValue
        )
        break
      case TYPE_NUMBER:
        editorState = createEditorStateFromText(cell.value.toString() as string)
        break
      case TYPE_TEXT:
      default:
        editorState = createEditorStateFromText(cell.value as string)
        break
    }
  }

  return editorState ? editorState : createEmptyEditorState()
}
