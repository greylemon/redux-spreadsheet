import { createSelector } from '@reduxjs/toolkit'
import { selectEditorState, selectIsEditMode } from './base'
import {
  selectCell,
  selectCellFontStyle,
  selectCellBlockStyle,
} from './activeSheet'
import { DraftInlineStyleType } from 'draft-js'
import { IInlineStyles } from '../../@types/state'

/* eslint-disable */
export const selectFactoryIsStyle = (
  editorStyle: DraftInlineStyleType,
  inlineStyleEqFn: (style: IInlineStyles) => boolean
) =>
  createSelector(
    [selectIsEditMode, selectCell, selectEditorState],
    (isEditMode, activeCell, editorState) => {
      let isToggled = false

      if (isEditMode) {
        isToggled = editorState.getCurrentInlineStyle().has(editorStyle)
      } else {
        if (activeCell && activeCell.style) {
          isToggled = inlineStyleEqFn(activeCell.style.font)
        }
      }

      return isToggled
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

export const selectCombinedCellStyle = createSelector(
  [selectCellFontStyle, selectCellBlockStyle],
  (fontStyle, blockStyle) => ({ ...fontStyle, ...blockStyle })
)
