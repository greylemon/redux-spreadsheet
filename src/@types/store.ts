import { UndoxState, Action } from 'undox'
import { IExcelState } from './state'
import { ThunkAction } from 'redux-thunk'

type IRootStore = UndoxState<IExcelState, Action>

export type IAppThunk = ThunkAction<void, IRootStore, unknown, Action<string>>

export default IRootStore
