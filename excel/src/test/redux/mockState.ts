import IRootStore from '../../@types/store/store'
import { initialState } from '../../redux/ExcelStore/store'

export const mockState: IRootStore = {
  Excel: {
    present: initialState,
    history: [],
    index: 0,
  },
}
