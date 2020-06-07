import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mockState } from './mockState'
import IRootStore from '../../@types/redux/store'
import rootReducer from '../../redux/reducers'

const middleWares = [thunk]

export const mockStore = createMockStore<IRootStore>(middleWares)

const store = mockStore(mockState)
store.replaceReducer(rootReducer)
