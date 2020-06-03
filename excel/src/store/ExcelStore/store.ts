import { createSlice } from '@reduxjs/toolkit'
import { IExcelState } from '../../@types/excel/state'
import { undox } from 'undox'
import {
  CELL_MOUSE_DOWN,
  CELL_MOUSE_ENTER,
  CELL_MOUSE_UP,
  CELL_MOUSE_DOWN_SHIFT,
  CELL_MOUSE_DOWN_CTRL,
} from './mouse/cell/cell.reducers'

const initialState: IExcelState = {
  activeCellPosition: { x: 1, y: 1 },

  data: {},

  stagnantSelectionAreas: [],

  sheetName: '',
  position: { x: 1, y: 1 },

  isEditMode: false,
  isSelectionMode: false,

  rowCount: 201,
  columnCount: 27,

  columnWidths: {},
  rowHeights: {},

  freezeColumnCount: 0,
  freezeRowCount: 0,

  inactiveSheets: {},
  selectionAreaIndex: -1,

  error: {},
}

export const ExcelStore = createSlice({
  name: 'EXCEL',
  initialState,
  reducers: {
    CELL_MOUSE_DOWN,
    CELL_MOUSE_ENTER,
    CELL_MOUSE_UP,
    CELL_MOUSE_DOWN_SHIFT,
    CELL_MOUSE_DOWN_CTRL,
  },
})

const ignoredActionsMap = {
  // EXCEL_MOUSE_DOWN: true,
  EXCEL_SELECT_OVER: true,
  // EXCEL_SET_SCROLL_DATA: true,
  // EXCEL_SET_ACTIVE_CELL_INPUT_VALUE: true
}

const UndoxExcelStore = undox(
  ExcelStore.reducer,
  undefined,
  undefined,
  ignoredActionsMap
)

export default UndoxExcelStore
