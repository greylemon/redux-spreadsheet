import { createSlice } from '@reduxjs/toolkit'
import { IExcelState } from '../@types/state'
import { undox } from 'undox'
import {
  CELL_MOUSE_DOWN,
  CELL_MOUSE_ENTER,
  CELL_MOUSE_UP,
  CELL_MOUSE_DOWN_SHIFT,
  CELL_MOUSE_DOWN_CTRL,
  CELL_DOUBLE_CLICK,
} from './reducers/mouse/cell'
import {
  CELL_KEY_DOWN,
  CELL_KEY_UP,
  CELL_KEY_RIGHT,
  CELL_KEY_LEFT,
  CELL_EDITOR_STATE_UPDATE,
  CELL_EDITOR_STATE_START,
} from './reducers/keyboard/cell'
import { EditorState } from 'draft-js'
import { UPDATE_STATE } from './reducers/events'
import { CHANGE_SHEET, CHANGE_SHEET_ORDER } from './reducers/sheet'
import { TYPE_FORMULA } from '../constants/cellTypes'

// TODO
export const initialExcelState: IExcelState = {
  sheetNames: ['Sheet1'],

  name: '',

  isEditMode: false,
  editorState: EditorState.createEmpty(),
  activeSheetName: 'Sheet1',

  error: {},

  formulaMap: {},

  sheetsMap: {
    Sheet1: {
      rowCount: 200,
      columnCount: 26,

      columnWidths: {},
      rowHeights: {},

      freezeColumnCount: 0,
      freezeRowCount: 0,
      hiddenColumns: {},
      hiddenRows: {},

      selectionAreaIndex: -1,
      inactiveSelectionAreas: [],
      activeCellPosition: { x: 1, y: 1 },

      data: {
        1: {
          1: {
            value: {
              formula: 'SUM(A2)',
            },
            type: TYPE_FORMULA,
          },
        },
      },
    },
  },
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
    CHANGE_SHEET,
    CHANGE_SHEET_ORDER,
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
