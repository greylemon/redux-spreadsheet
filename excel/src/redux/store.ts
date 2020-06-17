import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import IRootStore from '../@types/redux/store'
import { middleware, devTools } from './config'

export const useTypedSelector: TypedUseSelectorHook<IRootStore> = useSelector

const store = configureStore({
  reducer: rootReducer,
  devTools,
  middleware,
})

export default store
