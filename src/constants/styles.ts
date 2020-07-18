import { CSSProperties } from '@material-ui/core/styles/withStyles'

export const STYLE_SELECTION_BORDER_COLOR = 'rgba(75, 135, 255, 0.95)'
export const STYLE_SELECTION_BORDER_WIDTH = '1px'
export const STYLE_SELECTION_BORDER_STYLE = 'solid'

export const STYLE_CONTENT_Z_INDEX = 4
export const STYLE_OVERLAP_Z_INDEX = 2
export const STYLE_BLOCK_Z_INDEX = 2
export const STYLE_SELECTION_AREA_Z_INDEX = 10000
export const STYLE_ACTIVE_CELL_Z_INDEX = 10000

export const rowDraggerStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,

  width: '100%',
  height: '5px',
}

export const rowDraggerIndicatorStyle: CSSProperties = {
  cursor: 'ns-resize',
  backgroundColor: '#1E90FF',
}

export const columnDraggerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,

  width: '5px',
  height: '100%',
}

export const columnDraggerIndicatorStyle: CSSProperties = {
  cursor: 'ew-resize',
  backgroundColor: '#1E90FF',
}
