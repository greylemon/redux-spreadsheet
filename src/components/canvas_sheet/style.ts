import { CSSProperties } from 'react'
import {
  STYLE_SHEET_NAVIGATION_HEIGHT,
  STYLE_TOOL_BAR_HEIGHT,
  STYLE_APP_BAR_HEIGHT,
  DIVIDER_COUNT,
} from '../../constants/styles'
import { getScrollbarSize } from '../../tools/misc'

export const STYLE_SHEET_CONTAINER: CSSProperties = {
  display: 'flex',
  width: `calc(100%)`,
  height: `calc(100% - ${
    STYLE_TOOL_BAR_HEIGHT +
    STYLE_SHEET_NAVIGATION_HEIGHT +
    STYLE_APP_BAR_HEIGHT +
    DIVIDER_COUNT
  }px)`,
  backgroundColor: '#F8F8F8',
}

export const STYLE_SHEET_CONTENT: CSSProperties = {
  display: 'flex',
  width: `calc(100%)`,
  height: '100%',
}

export const STYLE_SHEET_OUTER: CSSProperties = {
  width: '100%',
  height: '100%',
}

export const STYLE_SHEET: CSSProperties = {
  width: '100%',
  height: `calc(100% - ${getScrollbarSize()}px)`,
}
