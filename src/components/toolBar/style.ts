import { STYLE_TOOL_BAR_HEIGHT } from '../../constants/styles'
import { CSSProperties } from 'react'

const toolBar: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'space-around',
  width: '100%',
  height: STYLE_TOOL_BAR_HEIGHT,
  padding: '0 20px',
  boxSizing: 'border-box',
}

export default toolBar
