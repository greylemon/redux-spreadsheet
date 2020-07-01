import { initialExcelState, ExcelActions } from '../../../src/redux/store'
import { IPosition, IArea } from '../../../src/@types/state'
import { mockStore, createRootMockStore } from '../mockStore'
import {
  selectActiveCellPosition,
  selectColumnCount,
  selectRowCount,
  selectSelectionArea,
  selectInactiveSelectionAreas,
} from '../../../src/redux/selectors'
import { nSelectActiveSheet } from '../../../src/redux/tools/selectors'

describe('Cell mouse operations', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  describe('Cell active cell', () => {
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

  describe('Cell selection', () => {
    it('All cells', () => {
      const initState = store.getState()
      const area: IArea = {
        start: { x: 1, y: 1 },
        end: { x: selectColumnCount(initState), y: selectRowCount(initState) },
      }

      store.dispatch(ExcelActions.CELL_MOUSE_DOWN(area.start))
      store.dispatch(ExcelActions.CELL_MOUSE_ENTER(area.end))

      expect(selectSelectionArea(store.getState())).toEqual(area)

      store.dispatch(ExcelActions.CELL_MOUSE_UP(area))

      const state3 = store.getState()
      const inactiveSelectionAreas = selectInactiveSelectionAreas(state3)
      expect(selectSelectionArea(state3)).toEqual(undefined)
      expect(inactiveSelectionAreas.length).toBe(1)
      expect(inactiveSelectionAreas[0]).toEqual(area)
    })
  })
})
