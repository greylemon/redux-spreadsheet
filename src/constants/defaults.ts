import { IPosition } from '../@types/state'

export const SHEET_ROW_COUNT = 200
export const SHEET_COLUMN_COUNT = 26

export const SHEET_MIN_ROW_COUNT = 200
export const SHEET_MIN_COLUMN_COUNT = 26

export const SHEET_MAX_ROW_COUNT = 4000
export const SHEET_MAX_COLUMN_COUNT = 100

export const SHEET_ROW_HEIGHT = 25
export const SHEET_COLUMN_WIDTH = 100

export const SHEET_ROW_HEIGHT_HIDDEN = 2
export const SHEET_COLUMN_WIDTH_HIDDEN = 2

export const SHEET_ROW_HEIGHT_HEADER = SHEET_ROW_HEIGHT
export const SHEET_COLUMN_WIDTH_HEADER = 40

export const SHEET_NAME = 'Sheet1'

export const SHEET_FREEZE_COLUMN_COUNT = 0
export const SHEET_FREEZE_ROW_COUNT = 0

export const ACTIVE_SELECTION_AREA = null
export const ACTIVE_CELL_SELECTION_AREA_INDEX = -1

export const CELL_ORIGIN_ROW = 1
export const CELL_ORIGIN_COLUMN = 1

export const SHEET_NAMES = [SHEET_NAME]
export const SHEET_CELL_DATA = []

export const SHEET_COLUMN_WIDTHS = []
export const SHEET_ROW_HEIGHTS = []

export const STAGNANT_SELECTION_AREAS = []

export const ACTIVE_CELL_POSITION: IPosition = {
  x: CELL_ORIGIN_COLUMN,
  y: CELL_ORIGIN_ROW,
}

export const SCROLL_DATA = {
  horizontalScrollDirection: 'forward',
  scrollLeft: 0,
  scrollTop: 0,
  scrollUpdateWasRequested: false,
  verticalScrollDirection: 'forward',
}

export const ROW_HEIGHT_SCALE = 2
export const COLUMN_WIDTH_SCALE = 11.07

export const WINDOW_OVERSCAN_COLUMN_COUNT = 5
export const WINDOW_OVERSCAN_ROW_COUNT = 20
