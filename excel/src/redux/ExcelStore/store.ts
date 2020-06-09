import { createSlice } from '@reduxjs/toolkit'
import { IExcelState } from '../../@types/excel/state'
import { undox } from 'undox'
import {
  CELL_MOUSE_DOWN,
  CELL_MOUSE_ENTER,
  CELL_MOUSE_UP,
  CELL_MOUSE_DOWN_SHIFT,
  CELL_MOUSE_DOWN_CTRL,
} from './mouse/cell'
import {
  CELL_KEY_DOWN,
  CELL_KEY_UP,
  CELL_KEY_RIGHT,
  CELL_KEY_LEFT,
} from './keyboard/cell'

export const initialExcelState: IExcelState = {
  activeCellPosition: { x: 1, y: 1 },

  data: {},

  inactiveSelectionAreas: [],

  sheetName: '',

  isEditMode: false,

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
  initialState: initialExcelState,
  reducers: {
    CELL_MOUSE_DOWN,
    CELL_MOUSE_ENTER,
    CELL_MOUSE_UP,
    CELL_MOUSE_DOWN_SHIFT,
    CELL_MOUSE_DOWN_CTRL,
    CELL_KEY_DOWN,
    CELL_KEY_UP,
    CELL_KEY_RIGHT,
    CELL_KEY_LEFT,
  },
})

const ignoredActionsMap = {
  [ExcelStore.actions.CELL_MOUSE_ENTER.type]: true,
  [ExcelStore.actions.CELL_KEY_DOWN.type]: true,
  [ExcelStore.actions.CELL_KEY_UP.type]: true,
  [ExcelStore.actions.CELL_KEY_RIGHT.type]: true,
  [ExcelStore.actions.CELL_KEY_LEFT.type]: true,
  [ExcelStore.actions.CELL_MOUSE_DOWN_CTRL.type]: true,
  [ExcelStore.actions.CELL_MOUSE_DOWN_SHIFT.type]: true,
  [ExcelStore.actions.CELL_MOUSE_UP.type]: true,
  [ExcelStore.actions.CELL_MOUSE_DOWN.type]: true,
}

const UndoxExcelStore = undox(
  ExcelStore.reducer,
  undefined,
  undefined,
  ignoredActionsMap
)

export default UndoxExcelStore
