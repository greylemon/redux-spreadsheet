import { createSlice } from '@reduxjs/toolkit'
import { IExcelState } from '../../@types/excel/state'
import { undox } from 'undox'
import {
  CELL_MOUSE_DOWN,
  CELL_MOUSE_ENTER,
  CELL_MOUSE_UP,
  CELL_MOUSE_DOWN_SHIFT,
  CELL_MOUSE_DOWN_CTRL,
  CELL_DOUBLE_CLICK,
} from './mouse/cell'
import {
  CELL_KEY_DOWN,
  CELL_KEY_UP,
  CELL_KEY_RIGHT,
  CELL_KEY_LEFT,
  CELL_EDITOR_STATE_UPDATE,
  CELL_EDITOR_STATE_START,
} from './keyboard/cell'
import { EditorState } from 'draft-js'
import { UPDATE_STATE } from './events'

export const initialExcelState: IExcelState = {
  activeCellPosition: { x: 1, y: 1 },

  data: {},

  inactiveSelectionAreas: [],

  name: '',

  isEditMode: false,
  editorState: EditorState.createEmpty(),

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
    CELL_DOUBLE_CLICK,
    CELL_EDITOR_STATE_UPDATE,
    CELL_EDITOR_STATE_START,
    UPDATE_STATE,
  },
})

export const ExcelActions = ExcelStore.actions

const ignoredActionsMap = {
  [ExcelActions.CELL_MOUSE_ENTER.type]: true,
  [ExcelActions.CELL_KEY_DOWN.type]: true,
  [ExcelActions.CELL_KEY_UP.type]: true,
  [ExcelActions.CELL_KEY_RIGHT.type]: true,
  [ExcelActions.CELL_KEY_LEFT.type]: true,
  [ExcelActions.CELL_MOUSE_DOWN_CTRL.type]: true,
  [ExcelActions.CELL_MOUSE_DOWN_SHIFT.type]: true,
  [ExcelActions.CELL_MOUSE_UP.type]: true,
  [ExcelActions.CELL_MOUSE_DOWN.type]: true,
  [ExcelActions.CELL_EDITOR_STATE_UPDATE.type]: true,
  [ExcelActions.CELL_DOUBLE_CLICK.type]: true,
  [ExcelActions.CELL_EDITOR_STATE_START.type]: true,
  [ExcelActions.UPDATE_STATE.type]: true,
}

const UndoxExcelStore = undox(
  ExcelStore.reducer,
  undefined,
  undefined,
  ignoredActionsMap
)

export default UndoxExcelStore
