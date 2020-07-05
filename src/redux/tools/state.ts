import { IExcelState } from '../../@types/state'
import IRootStore from '../../@types/store'

export const createRootStoreFromExcelState = (
  state: IExcelState
): IRootStore => ({
  present: state,
  history: [],
  index: 0,
})
