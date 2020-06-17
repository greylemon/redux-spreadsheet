import IRootStore from '../@types/redux/store'
import thunk from 'redux-thunk'

export const devTools = {
  stateSanitizer: (state: IRootStore) => ({
    Excel: {
      ...state.Excel,
      present: {
        ...state.Excel.present,
        inactiveSheets: {},
      },
    },
  }),
}

export const middleware = [thunk]
