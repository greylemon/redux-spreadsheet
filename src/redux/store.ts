import { createSlice } from '@reduxjs/toolkit'
import { undox } from 'undox'
import { createInitialExcelState } from './tools/state'
import { createActionIgnoreMap } from './tools/actions'

import * as MOUSE_REDUCERS from './reducers/mouse'
import * as KEYBOARD_REDUCERS from './reducers/keyboard'
import * as EVENT_REDUCERS from './reducers/events'
import * as SHEET_REDUCERS from './reducers/sheet'
import * as OPERATION_REDUCERS from './reducers/operations'
import * as STYLE_REDUCERS from './reducers/style'

export const initialExcelState = createInitialExcelState()

export const ExcelStore = createSlice({
  name: 'EXCEL',
  initialState: initialExcelState,
  reducers: {
    ...MOUSE_REDUCERS,
    ...KEYBOARD_REDUCERS,
    ...SHEET_REDUCERS,
    ...EVENT_REDUCERS,
    ...OPERATION_REDUCERS,
    ...STYLE_REDUCERS,
  },
})

export const ExcelActions = ExcelStore.actions

const ignoredActionsMap = createActionIgnoreMap()

const UndoxExcelStore = undox(
  ExcelStore.reducer,
  undefined,
  undefined,
  ignoredActionsMap
)

export default UndoxExcelStore
