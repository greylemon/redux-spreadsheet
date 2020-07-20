import { createSelector } from '@reduxjs/toolkit'
import { selectEditorState, selectIsEditMode } from './base'
import { selectCell } from './activeSheet'
import { DraftInlineStyleType } from 'draft-js'
import { IStyles } from '../../@types/state'

/* eslint-disable */
export const selectFactoryIsStyle = (
  editorStyle: DraftInlineStyleType,
  inlineStyleEqFn: (style: IStyles) => boolean
) =>
  createSelector(
    [selectIsEditMode, selectCell, selectEditorState],
    (isEditMode, activeCell, editorState) => {
      let isBold = false

      if (isEditMode) {
        isBold = editorState.getCurrentInlineStyle().has(editorStyle)
      } else {
        if (activeCell && activeCell.style) {
          isBold = inlineStyleEqFn(activeCell.style)
        }
      }

      return isBold
    }
  )
/* eslint-enable */

export const selectIsBold = selectFactoryIsStyle(
  'BOLD',
  (style) => style.fontWeight === 'bold'
)

export const selectIsUnderline = selectFactoryIsStyle(
  'UNDERLINE',
  (style) => style.textDecoration && style.textDecoration.includes('underline')
)

export const selectIsStrikeThrough = selectFactoryIsStyle(
  'STRIKETHROUGH',
  (style) =>
    style.textDecoration && style.textDecoration.includes('line-through')
)

export const selectIsItalic = selectFactoryIsStyle(
  'ITALIC',
  (style) => style.fontStyle === 'italic'
)
