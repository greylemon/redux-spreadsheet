import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { STYLE_APP_BAR_HEIGHT } from '../../constants/styles'

const STYLE_APP_BAR: CSSProperties = {
  display: 'flex',
  height: STYLE_APP_BAR_HEIGHT,
}

export const STYLE_APP_BAR_BUTTON_ICON: CSSProperties = {
  height: STYLE_APP_BAR_HEIGHT - 10,
  width: STYLE_APP_BAR_HEIGHT - 10,
}

export const STYLE_APP_BAR_CONTENT: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
}

export const STYLE_APP_BAR_TEXT_FIELD_INPUT: CSSProperties = {
  padding: '10 10 !important',
  height: STYLE_APP_BAR_HEIGHT / 2 - 4,
}

export const STYLE_APP_BAR_TEXT_FIELD: CSSProperties = {}

export const STYLE_APP_BAR_ICON: CSSProperties = {
  padding: 10,
  height: STYLE_APP_BAR_HEIGHT - 25,
  width: STYLE_APP_BAR_HEIGHT - 25,
  color: '#3CB371',
}

export default STYLE_APP_BAR
