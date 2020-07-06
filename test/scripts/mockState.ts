import IRootStore from '../../src/@types/store'
import { initialExcelState } from '../../src/redux/store'

export const mockState: IRootStore = {
  present: initialExcelState,
  history: [],
  index: 0,
}
