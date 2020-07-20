import { CSSProperties } from 'react'
import {
  STYLE_SHEET_NAVIGATION_HEIGHT,
  STYLE_UNSELECTABLE,
  STYLE_BOX_SHADOW,
} from '../../constants/styles'

const sheetNavigation: CSSProperties = {
  display: 'flex',
  height: STYLE_SHEET_NAVIGATION_HEIGHT,
  padding: '0 20px 0 40px',
  backgroundColor: 'rgba(238, 238, 238, 0.5)',
}

export const sheetNavigation__sheets = {
  height: '100%',
  display: 'flex',
  padding: '0 10px',
  margin: 'auto 0',
  overflow: 'auto',
  ...STYLE_UNSELECTABLE,
}

export const sheetNavigationContainer: CSSProperties = {
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

export const sheetNavigationSheetContainer_Active: CSSProperties = {
  color: 'green',
  ...STYLE_BOX_SHADOW('0px 0px 5px 2px rgba(107, 107, 107, 0.5)'),
  backgroundColor: 'white',
}

export const sheetNavigationSheetContainer_Inactive: CSSProperties = {
  color: 'gray',
  outline: '1px solid rgb(233, 233, 233)',
  outlineOffset: -1,
}

export const sheetNavigationSheet__sheetName: CSSProperties = {
  marginRight: 10,
}

export const sheetNavigationSheet__option: CSSProperties = {
  padding: 0,
  minWidth: 0,
}

export const sheetNavigationOptions: CSSProperties = {
  display: 'flex',
}

export const sheetNavigationOptions__addSheet: CSSProperties = {
  minWidth: `${STYLE_SHEET_NAVIGATION_HEIGHT} !important`,
}

export default sheetNavigation
