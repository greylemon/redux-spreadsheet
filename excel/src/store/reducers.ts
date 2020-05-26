import { combineReducers } from '@reduxjs/toolkit'

import ExcelStore from './ExcelStore'

const rootReducer = combineReducers({
  Excel: ExcelStore,
})

export default rootReducer
