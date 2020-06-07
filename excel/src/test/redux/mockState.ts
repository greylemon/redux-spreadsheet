import IRootStore from '../../@types/store/store'
import { initialExcelState } from '../../redux/ExcelStore/store'

export const mockState: IRootStore = {
  Excel: {
    present: initialExcelState,
    history: [],
    index: 0,
  },
}