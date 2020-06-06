import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import IRootStore from '../@types/store/store'

/**
 * Essentially useSelector with type declarations
 *
 * useSelector allows components to receive the store's data
 *
 * This makes store data access much easier as intellisense
 * is available due to the type declaration
 */
export const useTypedSelector: TypedUseSelectorHook<IRootStore> = useSelector

/**
 * The store is the single object where data is stored.
 * Every component has a way to access this data as well as update its contents.
 *
 * Reducers are the business logic functions for updating the state
 * Reducers must be pure functions; that is, every input must have the same output
 * and have no side effects, otherwise, bugs are more likely to occur.
 * This is because the store is a single object and can be updated through references.
 * Normally you would create shallow copies of the store’s data at every level you require change.
 * However, with Redux toolkit, you no longer have to create shallow copies
 * due to its use of the Immer library.
 *
 * Actions are the way the store will know which Reducer should be used to handle data updates of the store.
 * Actions contain a type, which specify the key of the reducer, as well as the data you
 * intend to send to the reducer to use.
 *
 * Action creators are the functions that creates the action objects.
 */
const store = configureStore({
  reducer: rootReducer,
  // devTools
})

export default store
