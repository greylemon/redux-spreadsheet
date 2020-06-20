import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockState } from './mockState'
import IRootStore from '../@types/store'
import rootReducer from '../redux/store'

const middleWares = [thunk]

export const mockStore = createMockStore<IRootStore>(middleWares)

const store = mockStore(mockState)
store.replaceReducer(rootReducer)
