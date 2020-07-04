import { createRootMockStore, mockStore } from '../mockStore'
import { ExcelActions } from '../../../src/redux/store'
import {
  selectActiveCellPositionRow,
  selectColumnCount,
  selectRowCount,
  selectActiveCellPositionColumn,
} from '../../../src/redux/selectors'
import cloneDeep from 'clone-deep'
import { mockState } from '../mockState'

describe('Cell keyboard operations', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  describe('Cell arrow operations', () => {
    it('Top endpoint', () => {
      const startRow = 1
      store.dispatch(ExcelActions.CELL_KEY_UP())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(startRow)

      store.dispatch(ExcelActions.CELL_KEY_DOWN())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(
        startRow + 1
      )

      store.dispatch(ExcelActions.CELL_KEY_UP())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(startRow)
    })

    it('Left endpoint', () => {
      const startColumn = 1
      store.dispatch(ExcelActions.CELL_KEY_LEFT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        startColumn
      )

      store.dispatch(ExcelActions.CELL_KEY_RIGHT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        startColumn + 1
      )

      store.dispatch(ExcelActions.CELL_KEY_LEFT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        startColumn
      )
    })

    it('Bottom endpoint', () => {
      const state = cloneDeep(mockState)
      state.present.activeCellPosition.y =
        state.present.sheetsMap.Sheet1.rowCount
      store = createRootMockStore(state)

      const rowCount = selectRowCount(store.getState())

      store.dispatch(ExcelActions.CELL_KEY_DOWN())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(rowCount)

      store.dispatch(ExcelActions.CELL_KEY_UP())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(
        rowCount - 1
      )

      store.dispatch(ExcelActions.CELL_KEY_DOWN())
      expect(selectActiveCellPositionRow(store.getState())).toEqual(rowCount)
    })

    it('Bottom endpoint', () => {
      const state = cloneDeep(mockState)
      state.present.activeCellPosition.x =
        state.present.sheetsMap.Sheet1.columnCount
      store = createRootMockStore(state)

      const columnCount = selectColumnCount(store.getState())

      store.dispatch(ExcelActions.CELL_KEY_RIGHT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        columnCount
      )

      store.dispatch(ExcelActions.CELL_KEY_LEFT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        columnCount - 1
      )

      store.dispatch(ExcelActions.CELL_KEY_RIGHT())
      expect(selectActiveCellPositionColumn(store.getState())).toEqual(
        columnCount
      )
    })
  })
})
