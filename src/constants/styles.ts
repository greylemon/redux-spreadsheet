import { CSSProperties } from 'react'
import { SHEET_COLUMN_WIDTH_HEADER, SHEET_ROW_HEIGHT_HEADER } from './defaults'

export const STYLE_ACTIVE_CELL_COLOR = 'rgb(25, 95, 240)'
export const STYLE_SELECTION_AREA = 'rgb(75, 135, 255)'
export const STYLE_SELECTION_BORDER_COLOR = 'rgba(75, 135, 255, 0.95)'
export const STYLE_SELECTION_BORDER_WIDTH = '1px'
export const STYLE_SELECTION_BORDER_STYLE = 'solid'

export const STYLE_CONTENT_Z_INDEX = 4
export const STYLE_OVERLAP_Z_INDEX = 3
export const STYLE_BLOCK_Z_INDEX = 3
export const STYLE_SELECTION_AREA_Z_INDEX = 10000
export const STYLE_ACTIVE_CELL_Z_INDEX = 10000

export const STYLE_TOOLBAR_BUTTON: CSSProperties = {
  minHeight: 25,
  minWidth: 25,
  height: 25,
  width: 25,
  padding: 15,
  color: '#585858',
}

export const STYLE_SHEET_NAVIGATION_HEIGHT = 40
export const STYLE_TOOL_BAR_HEIGHT = 40
export const STYLE_APP_BAR_HEIGHT = 70
export const DIVIDER_COUNT = 2

export const STYLE_UNSELECTABLE: CSSProperties = {
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
}

export const STYLE_BOX_SHADOW = (value: string): CSSProperties => ({
  WebkitBoxShadow: value,
  MozBoxShadow: value,
  boxShadow: value,
})

export const rowDraggerStyle: CSSProperties = {
  zIndex: 100000,
  position: 'absolute',
  bottom: 1,

  height: 7,
  width: SHEET_COLUMN_WIDTH_HEADER - 2,
  borderRadius: 1,
  boxSizing: 'border-box',
}

export const rowDraggerIndicatorStyle: CSSProperties = {
  backgroundColor: '#1E90FF',
}

export const columnDraggerStyle: CSSProperties = {
  zIndex: 100000,
  position: 'absolute',
  right: 1,

  width: 7,
  height: SHEET_ROW_HEIGHT_HEADER - 2,
  borderRadius: 1,
  boxSizing: 'border-box',
}

export const STYLE_BORDER_RADIUS = 1

export const columnDraggerIndicatorStyle: CSSProperties = {
  backgroundColor: '#1E90FF',
}

export const STYLE_CELL_BORDER = 'darkgray'
export const STYLE_HEADER_FILL = '#F8F8F8'
