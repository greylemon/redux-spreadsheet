import { UndoxState, Action } from 'undox'
import { IExcelState } from '../excel/state'

type IRootStore = UndoxState<IExcelState, Action>

export default IRootStore
