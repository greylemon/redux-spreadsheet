import { initialExcelState, ExcelActions } from '../../redux/store'
import { IPosition } from '../../@types/state'
import { mockStore } from '../mockStore'
import { mockState } from '../mockState'
import { selectActiveCellPosition } from '../../redux/selectors'
import rootReducer from '../../redux/store'
import { nSelectActiveSheet } from '../../redux/tools/selectors'

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
        const activeSheet = nSelectActiveSheet(initialExcelState)
        const position: IPosition = {
          x: activeSheet.columnCount,
          y: activeSheet.rowCount,
        }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(position)
      })
    })

    describe('move to invalid position', () => {
      it('move to negative position', () => {
        const activeSheet = nSelectActiveSheet(initialExcelState)
        const position: IPosition = { x: -1, y: -2 }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(activeSheet.activeCellPosition)
      })

      it('move to out of bound positive position', () => {
        const activeSheet = nSelectActiveSheet(initialExcelState)
        const position: IPosition = {
          x: activeSheet.columnCount + 1,
          y: activeSheet.rowCount + 1,
        }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(activeSheet.activeCellPosition)
      })
    })
  })
})
