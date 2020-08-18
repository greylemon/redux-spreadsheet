import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import rootReducer from './store'
import IRootStore from '../@types/store'
import { middleware, devTools } from './config'

export const useTypedSelector: TypedUseSelectorHook<IRootStore> = useSelector

const config = {
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development' && devTools,
  middleware,
}

const store = configureStore(config)

export default store
