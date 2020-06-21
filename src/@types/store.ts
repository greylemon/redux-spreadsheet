import { UndoxState, Action } from 'undox'
import { IExcelState } from './state'

type IRootStore = UndoxState<IExcelState, Action>

export default IRootStore
