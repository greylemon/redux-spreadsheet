import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { STYLE_APP_BAR_HEIGHT } from '../../constants/styles'

const STYLE_APP_BAR: CSSProperties = {
  display: 'flex',
  height: STYLE_APP_BAR_HEIGHT,
  padding: 5,
  boxSizing: 'border-box',
}

export const STYLE_APP_BAR_BUTTON_ICON: CSSProperties = {
  height: STYLE_APP_BAR_HEIGHT - 10,
  width: STYLE_APP_BAR_HEIGHT - 10,
}

export const STYLE_APP_BAR_CONTENT: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  marginLeft: 5,
}

export const STYLE_APP_BAR_ICON: CSSProperties = {
  padding: 10,
  height: STYLE_APP_BAR_HEIGHT - 25,
  width: STYLE_APP_BAR_HEIGHT - 25,
  color: '#3CB371',
}

export default STYLE_APP_BAR
