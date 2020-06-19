import IRootStore from '../@types/redux/store'
import thunk from 'redux-thunk'

export const devTools: any = {
  stateSanitizer: (state: IRootStore) => ({
    Excel: {
      ...state.Excel,
      present: {
        ...state.Excel.present,
        sheetsMap: '<<LONG_BLOB>>',
      },
    },
  }),
}

export const middleware = [thunk]
