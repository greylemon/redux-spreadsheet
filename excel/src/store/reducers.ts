import { combineReducers } from '@reduxjs/toolkit'

import ExcelStore from './ExcelStore'

const rootReducer = combineReducers({
  ExcelStore: ExcelStore.reducer,
})

export default rootReducer
