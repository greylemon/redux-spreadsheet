import { createSelector } from '@reduxjs/toolkit'
import { DraftInlineStyleType } from 'draft-js'
import {
  selectCellEditorState,
  selectIsEditMode,
  selectIsSelectionMode,
  selectInactiveSelectionAreas,
} from './base'
import {
  selectCell,
  selectCellFontStyle,
  selectCellBlockStyle,
  selectMerged,
} from './activeSheet'
import { IRichTextValue } from '../../@types/state'
import { checkIsAreaEqualPosition } from '../../tools'
import { TYPE_RICH_TEXT } from '../../constants/types'
import { IInlineStyleEqFn } from '../../@types/functions'

/* eslint-disable */
export const selectFactoryIsStyle = (
  editorStyle: DraftInlineStyleType,
  inlineStyleEqFn: IInlineStyleEqFn
) =>
  createSelector(
    [selectIsEditMode, selectCell, selectCellEditorState],
    (isEditMode, activeCell, editorState) => {
      let isToggled = false

      if (isEditMode) {
        isToggled = editorState.getCurrentInlineStyle().has(editorStyle)
      } else {
        if (activeCell) {
          if (activeCell.type === TYPE_RICH_TEXT) {
            const richText = activeCell.value as IRichTextValue

            if (richText.length) {
              const fragments = richText[0].fragments

              if (fragments.length) {
                isToggled =
                  fragments[0].styles && inlineStyleEqFn(fragments[0].styles)
              }
            }
          } else if (activeCell.style && activeCell.style.font) {
            isToggled = inlineStyleEqFn(activeCell.style.font)
          }
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
  (style) =>
    style.textDecoration !== undefined &&
    style.textDecoration.includes('underline')
)

export const selectIsStrikeThrough = selectFactoryIsStyle(
  'STRIKETHROUGH',
  (style) =>
    style.textDecoration !== undefined &&
    style.textDecoration.includes('line-through')
)

export const selectIsItalic = selectFactoryIsStyle(
  'ITALIC',
  (style) => style.fontStyle === 'italic'
)

export const selectCombinedCellStyle = createSelector(
  [selectCellFontStyle, selectCellBlockStyle],
  (fontStyle, blockStyle) => ({ ...fontStyle, ...blockStyle })
)

export const selectIsMergable = createSelector(
  [selectInactiveSelectionAreas, selectIsSelectionMode, selectMerged],
  (inactiveSelectionAreas, isSelectionMode, merged) =>
    !isSelectionMode &&
    ((inactiveSelectionAreas.length === 1 &&
      !checkIsAreaEqualPosition(inactiveSelectionAreas[0])) ||
      (inactiveSelectionAreas.length === 0 && merged !== undefined))
)
