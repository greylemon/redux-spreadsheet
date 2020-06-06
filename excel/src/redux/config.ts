import IRootStore from '../@types/store/store'

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
