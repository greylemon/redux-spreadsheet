import IRootStore from '../@types/store'
import thunk from 'redux-thunk'

export const devTools: any = {
  stateSanitizer: (state: IRootStore) => ({
    ...state,
    present: {
      ...state.present,
      sheetsMap: '<<LONG_BLOB>>',
      formulaMap: '<<LONG_BLOB>>',
    },
  }),
  actionSanitizer: (action: any) => {
    switch (action.type) {
      case 'EXCEL/UPDATE_STATE':
        return {
          ...action,
          payload: {
            ...action.payload,
            sheetsMap: '<<LONG_BLOB>>',
            formulaMap: '<<LONG_BLOB>>',
          },
        }
      default:
        return action
    }
  },
}

export const middleware = [thunk]
