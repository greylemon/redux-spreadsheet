import {
  initialExcelState,
  ExcelActions,
} from '../../../../redux/ExcelStore/store'
import { IPosition } from '../../../../@types/excel/state'
import { mockStore } from '../../mockStore'
import { mockState } from '../../mockState'
import { selectActiveCellPosition } from '../../../../redux/ExcelStore/selectors'
import rootReducer from '../../../../redux/reducers'

describe('cell mouse operations', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = mockStore(mockState)
    store.replaceReducer(rootReducer)
  })

  describe('cell mouse down', () => {
    describe('move to valid position', () => {
      it('move to (5, 3)', () => {
        const position: IPosition = { x: 5, y: 3 }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(position)
      })

      it('move to (initial column count, initial row count)', () => {
        const position: IPosition = {
          x: initialExcelState.columnCount,
          y: initialExcelState.rowCount,
        }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(position)
      })
    })

    describe('move to invalid position', () => {
      it('move to negative position', () => {
        const position: IPosition = { x: -1, y: -1 }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(initialExcelState.activeCellPosition)
      })

      it('move to out of bound positive position', () => {
        const position: IPosition = {
          x: initialExcelState.columnCount + 1,
          y: initialExcelState.rowCount + 1,
        }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(initialExcelState.activeCellPosition)
      })
    })
  })
})
