import {
  IPosition,
  IRowCount,
  IColumnCount,
  ICell,
  IFormulaValue,
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
      case TYPE_FORMULA: {
        const formulaValue = (cell.value as IFormulaValue).formula
        if (formulaValue)
          editorState = createEditorStateFromText(`=${formulaValue}`)
        break
      }
      case TYPE_RICH_TEXT:
        editorState = createEditorStateFromRichText(
          cell.value as IRichTextValue
        )
        break
      case TYPE_TEXT:
      default:
        editorState = createEditorStateFromText(cell.value as string)
        break
    }
  }

  return editorState ? editorState : createEmptyEditorState()
}
