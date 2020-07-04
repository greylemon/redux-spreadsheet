import IRootStore from '../@types/store'
import thunk from 'redux-thunk'
import { ExcelActions } from './store'

const BLOB_PLACEHOLDER = '<<LONG_BLOB>>'

export const devTools: any = {
  stateSanitizer: (state: IRootStore) => ({
    ...state,
    present: {
      ...state.present,
      sheetsMap: BLOB_PLACEHOLDER,
    },
  }),
  actionSanitizer: (action: any) => {
    switch (action.type) {
      case ExcelActions.UPDATE_STATE.type:
        return {
          ...action,
          payload: {
            ...action.payload,
            sheetsMap: BLOB_PLACEHOLDER,
          },
        }
      default:
        return action
    }
  },
}

export const middleware = [thunk]
