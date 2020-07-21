import { CSSProperties } from 'react'
import { STYLE_TOOL_BAR_HEIGHT } from '../../constants/styles'

const toolBar: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'space-around',
  width: '100%',
  height: STYLE_TOOL_BAR_HEIGHT,
  padding: '0 20px',
  boxSizing: 'border-box',
}

export const toolBar__content: CSSProperties = {
  display: 'flex',
}

export const toggledOn: CSSProperties = {
  color: 'green',
  backgroundColor: 'lightgreen',
}

export const disabledStyle: CSSProperties = {
  color: '#B0B0B0',
}

export default toolBar
