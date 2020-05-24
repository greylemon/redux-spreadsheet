import { combineReducers } from '@reduxjs/toolkit'

import ExcelStore from './ExcelStore'

const rootReducer = combineReducers({
  ExcelStore,
} as any)

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
