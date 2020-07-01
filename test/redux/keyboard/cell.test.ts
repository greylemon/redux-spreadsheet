import { createRootMockStore, mockStore } from '../mockStore'
import { ExcelActions } from '../../../src/redux/store'
import { selectActiveCellPosition } from '../../../src/redux/selectors'

describe('Cell keyboard operations', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  describe('Cell arrow up', () => {
    it('Top endpoint', () => {
      store.dispatch(ExcelActions.CELL_KEY_UP())
      expect(selectActiveCellPosition(store.getState())).toEqual({ x: 1, y: 1 })
    })
  })

  describe('Cell arrow left', () => {
    it('Left endpoint', () => {
      store.dispatch(ExcelActions.CELL_KEY_LEFT())
      expect(selectActiveCellPosition(store.getState())).toEqual({ x: 1, y: 1 })
    })
  })
})
