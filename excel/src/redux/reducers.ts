import { combineReducers } from '@reduxjs/toolkit'

import ExcelStore from './ExcelStore'

const rootReducer = combineReducers({
  /**
   * Normally, you would get reducers using ExcelStore.reducer since reducers are normally
   * Created using createSlice. However, the ExcelStore uses the Undox middleware,
   * whose return type is the reducer itself
   */
  Excel: ExcelStore,
})

export default rootReducer
