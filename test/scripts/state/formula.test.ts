import { mockStore, createRootMockStore } from '../mockStore'
import cloneDeep from 'clone-deep'
import { initialExcelState, ExcelActions } from '../../../src/redux/store'
import { SHEET_NAME } from '../../../src/constants/defaults'
import { TYPE_FORMULA, TYPE_NUMBER } from '../../../src/constants/cellTypes'
import {
  selectActiveSheetFormulaResults,
  selectExcel,
} from '../../../src/redux/selectors'

describe('Formula', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  describe('Existing formulas', () => {
    it('Single level formulas', () => {
      let state = cloneDeep(initialExcelState)

      state.sheetsMap[SHEET_NAME].data = {
        1: {
          1: {
            value: 5,
            type: TYPE_NUMBER,
          },
          2: {
            value: 'SUM(A1)',
            type: TYPE_FORMULA,
          },
        },
      }

      store.dispatch(ExcelActions.UPDATE_STATE(state))

      const formulaResult = {
        1: {
          2: 5,
        },
      }

      expect(selectActiveSheetFormulaResults(store.getState())).toEqual(
        formulaResult
      )

      state = cloneDeep(selectExcel(store.getState()))

      state.sheetsMap[SHEET_NAME].data[1][3] = {
        value: 8,
        type: TYPE_NUMBER,
      }

      state.sheetsMap[SHEET_NAME].data[1][4] = {
        value: 'SUM(A1,C1)',
        type: TYPE_FORMULA,
      }

      store.dispatch(ExcelActions.UPDATE_STATE(state))

      const formulaResult2 = {
        1: {
          2: 5,
          4: 13,
        },
      }
      expect(selectActiveSheetFormulaResults(store.getState())).toEqual(
        formulaResult2
      )
    })

    it('Multi-level formulas', () => {
      let state = cloneDeep(initialExcelState)

      state.sheetsMap[SHEET_NAME].data = {
        1: {
          1: {
            value: 5,
            type: TYPE_NUMBER,
          },
          2: {
            value: 'SUM(A1)',
            type: TYPE_FORMULA,
          },
          3: {
            value: 'SUM(B1)',
            type: TYPE_FORMULA,
          },
        },
      }

      store.dispatch(ExcelActions.UPDATE_STATE(state))

      const formulaResult = {
        1: {
          2: 5,
          3: 5,
        },
      }

      expect(selectActiveSheetFormulaResults(store.getState())).toEqual(
        formulaResult
      )

      state = cloneDeep(selectExcel(store.getState()))

      state.sheetsMap[SHEET_NAME].data[2] = {
        5: {
          value: 'SUM(B1,C1,13)',
          type: TYPE_FORMULA,
        },
      }

      store.dispatch(ExcelActions.UPDATE_STATE(state))

      const formulaResult2 = {
        1: {
          2: 5,
          3: 5,
        },
        2: {
          5: 23,
        },
      }

      expect(selectActiveSheetFormulaResults(store.getState())).toEqual(
        formulaResult2
      )
    })
  })
})
