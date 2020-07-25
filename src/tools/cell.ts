import { EditorState, RichUtils } from 'draft-js'
import {
  IPosition,
  IRowCount,
  IColumnCount,
  ICell,
  IRichTextValue,
  IInlineStyles,
} from '../@types/state'
import {
  createEmptyEditorState,
  createEditorStateFromText,
  createEditorStateFromRichText,
} from './text'
import {
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_RICH_TEXT,
  TYPE_NUMBER,
} from '../constants/types'
import {
  checkIsBlockBold,
  checkIsBlockUndeline,
  checkIsBlockStrikethrough,
  checkIsBlockItalic,
  getSelectionState,
} from './style'

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

export const getFontBlockEditorState = (
  blockEditorState: EditorState,
  style: IInlineStyles
): EditorState => {
  if (checkIsBlockBold(style))
    blockEditorState = RichUtils.toggleInlineStyle(blockEditorState, 'BOLD')
  if (checkIsBlockUndeline(style))
    blockEditorState = RichUtils.toggleInlineStyle(
      blockEditorState,
      'UNDERLINE'
    )
  if (checkIsBlockStrikethrough(style))
    blockEditorState = RichUtils.toggleInlineStyle(
      blockEditorState,
      'STRIKETHROUGH'
    )
  if (checkIsBlockItalic(style))
    blockEditorState = RichUtils.toggleInlineStyle(blockEditorState, 'ITALIC')

  return blockEditorState
}

export const createEditorStateFromCell = (
  cell: ICell | null,
  focusEnd = false
): EditorState => {
  let editorState: EditorState | null = null

  if (cell) {
    if (cell.value !== undefined) {
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
          editorState = createEditorStateFromText(
            cell.value.toString() as string
          )
          break
        case TYPE_TEXT:
        default:
          editorState = createEditorStateFromText(cell.value as string)
          break
      }
    }

    if (cell.style && cell.style.font) {
      const blockEditorState = EditorState.moveFocusToEnd(
        editorState || createEmptyEditorState()
      )

      editorState = getFontBlockEditorState(
        EditorState.acceptSelection(
          blockEditorState,
          getSelectionState(blockEditorState)
        ),
        cell.style.font
      )
    }
  }

  editorState = editorState || createEmptyEditorState()

  if (focusEnd) editorState = EditorState.moveFocusToEnd(editorState)

  return editorState
}
