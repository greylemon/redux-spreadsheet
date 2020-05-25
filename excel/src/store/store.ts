import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import RootStore from '../@types/store'

export const useTypedSelector: TypedUseSelectorHook<RootStore> = useSelector

const store = configureStore({
  reducer: rootReducer,
})

export default store
