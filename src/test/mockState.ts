import IRootStore from '../@types/store'
import { initialExcelState } from '../redux/store'

export const mockState: IRootStore = {
  present: initialExcelState,
  history: [],
  index: 0,
}
