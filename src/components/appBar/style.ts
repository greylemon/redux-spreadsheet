import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { STYLE_APP_BAR_HEIGHT } from '../../constants/styles'

const appBarStyle: CSSProperties = {
  display: 'flex',
  height: STYLE_APP_BAR_HEIGHT,
}

export const appBarButtonIconStyle: CSSProperties = {
  height: STYLE_APP_BAR_HEIGHT - 10,
  width: STYLE_APP_BAR_HEIGHT - 10,
}

export const appBarContentStyle: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
}

export const appBarTextFieldInputStyle: CSSProperties = {
  padding: '10 10 !important',
  height: STYLE_APP_BAR_HEIGHT / 2 - 4,
}

export const appBarTextFieldStyle: CSSProperties = {}

export const appBarIconStyle: CSSProperties = {
  padding: 10,
  height: STYLE_APP_BAR_HEIGHT - 25,
  width: STYLE_APP_BAR_HEIGHT - 25,
  color: '#3CB371',
}

export default appBarStyle
