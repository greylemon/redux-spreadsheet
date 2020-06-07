import { UndoxState, Action } from 'undox'
import { IExcelState } from '../excel/state'

export type IExcelStore = UndoxState<IExcelState, Action>

type IRootStore = {
  Excel: IExcelStore
}

export default IRootStore
