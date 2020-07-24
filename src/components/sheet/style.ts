import { CSSProperties } from 'react'
import {
  STYLE_SHEET_NAVIGATION_HEIGHT,
  STYLE_TOOL_BAR_HEIGHT,
  STYLE_APP_BAR_HEIGHT,
  DIVIDER_COUNT,
} from '../../constants/styles'

const STYLE_SHEET: CSSProperties = {
  width: '100%',
  height: `calc(100% - ${
    STYLE_TOOL_BAR_HEIGHT +
    STYLE_SHEET_NAVIGATION_HEIGHT +
    STYLE_APP_BAR_HEIGHT +
    DIVIDER_COUNT
  }px)`,
}

export default STYLE_SHEET
