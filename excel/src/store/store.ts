import { configureStore } from '@reduxjs/toolkit'
import rootReducer, { RootStore } from './reducers'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const useTypedSelector: TypedUseSelectorHook<RootStore> = useSelector

const store = configureStore({
  reducer: rootReducer,
})

export default store
