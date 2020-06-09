import IRootStore from '../@types/redux/store'

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

export const middleware = []
