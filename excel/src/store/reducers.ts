import { combineReducers } from '@reduxjs/toolkit'

import ExcelStore from './ExcelStore'
import ExcelState from '../@types/excel'

const rootReducer = combineReducers({
  ExcelStore: ExcelStore.reducer,
})

export type RootStore = {
  ExcelStore: ExcelState
}

export default rootReducer
