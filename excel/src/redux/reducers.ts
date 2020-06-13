import { combineReducers } from '@reduxjs/toolkit'

import UndoxExcelStore from './ExcelStore/store'

const rootReducer = combineReducers({
  /**
   * Normally, you would get reducers using ExcelStore.reducer since reducers are normally
   * Created using createSlice. However, the ExcelStore uses the Undox middleware,
   * whose return type is the reducer itself
   */
  Excel: UndoxExcelStore,
})

export default rootReducer
