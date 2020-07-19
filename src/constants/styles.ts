import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { SHEET_COLUMN_WIDTH_HEADER, SHEET_ROW_HEIGHT_HEADER } from './defaults'

export const STYLE_SELECTION_BORDER_COLOR = 'rgba(75, 135, 255, 0.95)'
export const STYLE_SELECTION_BORDER_WIDTH = '1px'
export const STYLE_SELECTION_BORDER_STYLE = 'solid'

export const STYLE_CONTENT_Z_INDEX = 4
export const STYLE_OVERLAP_Z_INDEX = 2
export const STYLE_BLOCK_Z_INDEX = 2
export const STYLE_SELECTION_AREA_Z_INDEX = 10000
export const STYLE_ACTIVE_CELL_Z_INDEX = 10000

export const rowDraggerStyle: CSSProperties = {
  zIndex: 100000,
  position: 'absolute',
  bottom: -5,

  width: SHEET_COLUMN_WIDTH_HEADER - 1,
  height: 5,

  borderRadius: 1,
}

export const rowDraggerIndicatorStyle: CSSProperties = {
  backgroundColor: '#1E90FF',
}

export const columnDraggerStyle: CSSProperties = {
  zIndex: 100000,
  position: 'absolute',
  top: 0,
  right: -5,

  width: 5,
  height: SHEET_ROW_HEIGHT_HEADER - 1,
  borderRadius: 1,
}

export const columnDraggerIndicatorStyle: CSSProperties = {
  backgroundColor: '#1E90FF',
}
