import { UndoxState, Action } from 'undox'
import ExcelState from './excel'

export type ExcelStore = UndoxState<ExcelState, Action>

type RootStore = {
  Excel: ExcelStore
}

export default RootStore
