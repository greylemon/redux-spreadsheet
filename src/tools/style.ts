import { EditorState, SelectionState } from 'draft-js'
import {
  IInlineStyles,
  IEditorState,
  ITextDecorationStyle,
} from '../@types/state'
import { ISetInlineStyleFn } from '../@types/functions'

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

export const setItalicStyle: ISetInlineStyleFn = (style) => {
  style.fontStyle = 'italic'
}

export const setBoldStyle: ISetInlineStyleFn = (style) => {
  style.fontWeight = 'bold'
}

export const setStrikethroughStyle: ISetInlineStyleFn = (style) => {
  if (style.textDecoration === undefined) style.textDecoration = 'line-through'

  if (style.textDecoration && !style.textDecoration.includes('line-through'))
    style.textDecoration += ' line-through'
}

export const setUnderlineStyle: ISetInlineStyleFn = (style) => {
  if (style.textDecoration === undefined) style.textDecoration = 'underline'

  if (style.textDecoration && !style.textDecoration.includes('underline'))
    style.textDecoration += ' underline'
}

export const unsetItalicStyle: ISetInlineStyleFn = (style) =>
  delete style.fontStyle
export const unsetBoldStyle: ISetInlineStyleFn = (style) =>
  delete style.fontWeight
export const unsetUnderlineStyle: ISetInlineStyleFn = (style) => {
  if (style.textDecoration && style.textDecoration.includes('underline')) {
    style.textDecoration = style.textDecoration
      .replace('underline', '')
      .trim() as ITextDecorationStyle
  }

  if (style.textDecoration === '') delete style.textDecoration
}
export const unsetStrikethroughStyle: ISetInlineStyleFn = (style) => {
  if (style.textDecoration && style.textDecoration.includes('line-through')) {
    style.textDecoration = style.textDecoration
      .replace('line-through', '')
      .trim() as ITextDecorationStyle
  }

  if (style.textDecoration === '') delete style.textDecoration
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
