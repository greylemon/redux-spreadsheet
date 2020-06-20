import IRootStore from '../../@types/redux/store'
import { initialExcelState } from '../../redux/ExcelStore/store'

export const mockState: IRootStore = {
  present: initialExcelState,
  history: [],
  index: 0,
}
