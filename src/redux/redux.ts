import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import rootReducer from './store'
import IRootStore from '../@types/store'
import { middleware, devTools } from './config'

export const useTypedSelector: TypedUseSelectorHook<IRootStore> = useSelector

const store = configureStore({
  reducer: rootReducer,
  devTools,
  middleware,
})

export default store
