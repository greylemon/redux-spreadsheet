import thunk from 'redux-thunk'
import IRootStore from '../@types/store'
import { ExcelActions } from './store'
import { IExcelState } from '../@types/state'

const BLOB_PLACEHOLDER = '<<LONG_BLOB>>'

const BIG_DATA: Partial<IExcelState> | any = {
  sheetsMap: BLOB_PLACEHOLDER,
  results: BLOB_PLACEHOLDER,
  dependentReferences: BLOB_PLACEHOLDER,
  independentReferences: BLOB_PLACEHOLDER,
}

export const devTools: any = {
  stateSanitizer: (state: IRootStore) => ({
    ...state,
    present: {
      ...state.present,
      ...BIG_DATA,
    },
  }),
  actionSanitizer: (action: any) => {
    switch (action.type) {
      case ExcelActions.UPDATE_STATE.type:
        return {
          ...action,
          payload: {
            ...action.payload,
            ...BIG_DATA,
          },
        }
      default:
        return action
    }
  },
}

export const middleware = [thunk]
