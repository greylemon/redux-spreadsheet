import IRootStore from '../@types/store'
import thunk from 'redux-thunk'

export const devTools: any = {
  stateSanitizer: (state: IRootStore) => ({
    ...state,
    present: {
      ...state.present,
      sheetsMap: '<<LONG_BLOB>>',
    },
  }),
}

export const middleware = [thunk]
