import { initialExcelState, ExcelActions } from '../../../src/redux/store'
import { IPosition } from '../../../src/@types/state'
import { mockStore, createRootMockStore } from '../mockStore'
import { selectActiveCellPosition } from '../../../src/redux/selectors'
import { nSelectActiveSheet } from '../../../src/redux/tools/selectors'

describe('Cell mouse operations', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  describe('Cell mouse down', () => {
    describe('Move to valid position', () => {
      it('Move to bounded position', () => {
        const position: IPosition = { x: 5, y: 3 }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(position)
      })

      it('Move to (initial column count, initial row count)', () => {
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

    describe('Move to invalid position', () => {
      it('Move to negative position', () => {
        const activeSheet = nSelectActiveSheet(initialExcelState)
        const position: IPosition = { x: -1, y: -2 }

        store.dispatch(ExcelActions.CELL_MOUSE_DOWN(position))

        const activeCellPosition = selectActiveCellPosition(store.getState())

        expect(activeCellPosition).toEqual(activeSheet.activeCellPosition)
      })

      it('Move to out of bound positive position', () => {
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
