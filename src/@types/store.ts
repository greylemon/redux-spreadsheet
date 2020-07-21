import { UndoxState, Action } from 'undox'
import { ThunkAction } from 'redux-thunk'
import { IExcelState } from './state'

type IRootStore = UndoxState<IExcelState, Action>

export type IAppThunk = ThunkAction<void, IRootStore, unknown, Action<string>>

export default IRootStore
