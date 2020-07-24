import { CSSProperties } from 'react'
import {
  STYLE_SHEET_NAVIGATION_HEIGHT,
  STYLE_UNSELECTABLE,
  STYLE_BOX_SHADOW,
} from '../../constants/styles'

const STYLE_SHEET_NAVIGATION: CSSProperties = {
  display: 'flex',
  height: STYLE_SHEET_NAVIGATION_HEIGHT,
  padding: '0 20px 0 40px',
  backgroundColor: 'rgba(238, 238, 238, 0.5)',
}

export const STYLE_SHEET_NAVIGATION__SHEETS = {
  height: '100%',
  display: 'flex',
  padding: '0 10px',
  margin: 'auto 0',
  overflow: 'auto',
  ...STYLE_UNSELECTABLE,
}

export const STYLE_SHEET_NAVIGATION__CONTAINER: CSSProperties = {
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
  listStyleType: 'none',
  fontWeight: 500,
  fontSize: 15,
  padding: '0 12px',
  width: 'fit-content',
  whiteSpace: 'nowrap',
}

export const STYLE_SHEET_NAVIGATION__CONTAINER_ACTIVE: CSSProperties = {
  color: 'green',
  ...STYLE_BOX_SHADOW('0px 0px 5px 2px rgba(107, 107, 107, 0.5)'),
  backgroundColor: 'white',
}

export const STYLE_SHEET_NAVIGATION__CONTAINER_INACTIVE: CSSProperties = {
  color: 'gray',
  outline: '1px solid rgb(233, 233, 233)',
  outlineOffset: -1,
}

export const STYLE_SHEET_NAVIGATION__SHEET_SHEETNAME: CSSProperties = {
  marginRight: 10,
}

export const STYLE_SHEET_NAVIGATION__OPTION: CSSProperties = {
  padding: 0,
  minWidth: 0,
}

export const STYLE_SHEET_NAVIGATION__OPTIONS: CSSProperties = {
  display: 'flex',
}

export const STYLE_SHEET_NAVIGATION__ADD_SHEET: CSSProperties = {
  minWidth: `${STYLE_SHEET_NAVIGATION_HEIGHT} !important`,
}

export default STYLE_SHEET_NAVIGATION
