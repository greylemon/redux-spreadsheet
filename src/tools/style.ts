import { IInlineStyles, IEditorState } from '../@types/state'
import { EditorState, SelectionState } from 'draft-js'

export const checkIsBlockBold = (style: IInlineStyles): boolean =>
  style.fontWeight === 'bold'

export const checkIsBlockItalic = (style: IInlineStyles): boolean =>
  style.fontStyle === 'italic'

export const checkIsBlockStrikethrough = (style: IInlineStyles): boolean =>
  style.textDecoration && style.textDecoration.includes('line-through')

export const checkIsBlockUndeline = (style: IInlineStyles): boolean =>
  style.textDecoration && style.textDecoration.includes('underline')

export const getSelectionState = (editorState: EditorState): SelectionState => {
  const currentContent = editorState.getCurrentContent()

  return editorState.getSelection().merge({
    anchorKey: currentContent.getFirstBlock().getKey(),
    anchorOffset: 0,
    focusOffset: currentContent.getLastBlock().getText().length,
    focusKey: currentContent.getLastBlock().getKey(),
  })
}

export const setBoldStyle = (style: IInlineStyles): void => {
  style.fontWeight = 'bold'
}

export const setItalicStyle = (style: IInlineStyles): void => {
  style.fontStyle = 'italic'
}

export const setStrikethroughStyle = (style: IInlineStyles): void => {
  style.textDecoration
    ? (style.textDecoration += ' line-through')
    : 'line-through'
}

export const setUnderlineStyle = (style: IInlineStyles): void => {
  style.textDecoration ? (style.textDecoration += ' underline') : 'underline'
}

export const getFirstSelectionState = (
  editorState: EditorState
): SelectionState => {
  const currentContent = editorState.getCurrentContent()

  return editorState.getSelection().merge({
    anchorKey: currentContent.getFirstBlock().getKey(),
    anchorOffset: 0,
    focusOffset: 0,
    focusKey: currentContent.getFirstBlock().getKey(),
  })
}

export const getFontStyleFromEditorState = (
  editorState: IEditorState
): IInlineStyles | null => {
  const style: IInlineStyles = {}
  const inlineStyle = editorState.getCurrentInlineStyle()

  if (inlineStyle.has('BOLD')) setBoldStyle(style)
  if (inlineStyle.has('ITALIC')) setItalicStyle(style)
  if (inlineStyle.has('STRIKETHROUGH')) setStrikethroughStyle(style)
  if (inlineStyle.has('UNDERLINE')) setUnderlineStyle(style)

  return Object.keys(style).length ? style : null
}
