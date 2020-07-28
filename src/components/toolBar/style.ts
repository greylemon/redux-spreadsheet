import { CSSProperties } from 'react'
import { STYLE_TOOL_BAR_HEIGHT } from '../../constants/styles'

const STYLE_TOOL_BAR: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'space-around',
  width: '100%',
  height: STYLE_TOOL_BAR_HEIGHT,
  padding: '0 20px',
  boxSizing: 'border-box',
}

export const STYLE_TOOL_BAR_CONTENT: CSSProperties = {
  display: 'flex',
}

export const STYLE_VERTICAL_DIVIDER: CSSProperties = {
  margin: '0 3px',
}

export default STYLE_TOOL_BAR
