import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockState } from './mockState'
import IRootStore from '../../src/@types/store'
import rootReducer from '../../src/redux/store'

const middleWares = [thunk]

export const mockStore = createMockStore<IRootStore>(middleWares)

const store = mockStore(mockState)
store.replaceReducer(rootReducer)
