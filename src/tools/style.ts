import { IStyles } from '../@types/state'
import { EditorState, SelectionState } from 'draft-js'

export const checkIsBlockBold = (style: IStyles): boolean =>
  style.font.fontWeight === 'bold'

export const checkIsBlockItalic = (style: IStyles): boolean =>
  style.font.fontStyle === 'italic'

export const checkIsBlockStrikethrough = (style: IStyles): boolean =>
  style.font.textDecoration &&
  style.font.textDecoration.includes('line-through')

export const checkIsBlockUndeline = (style: IStyles): boolean =>
  style.font.textDecoration && style.font.textDecoration.includes('underline')

export const getSelectionState = (editorState: EditorState): SelectionState => {
  const currentContent = editorState.getCurrentContent()

  return editorState.getSelection().merge({
    anchorKey: currentContent.getFirstBlock().getKey(),
    anchorOffset: 0,
    focusOffset: currentContent.getLastBlock().getText().length,
    focusKey: currentContent.getLastBlock().getKey(),
  })
}
