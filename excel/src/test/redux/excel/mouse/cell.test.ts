import { ExcelStore } from '../../../../redux/ExcelStore/store'
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

  it('cell mouse down', () => {
    const position: IPosition = { x: 5, y: 3 }

    store.dispatch(ExcelStore.actions.CELL_MOUSE_DOWN(position))

    const activeCellPosition = selectActiveCellPosition(store.getState())

    const actions = store.getActions()

    expect(actions).toEqual([ExcelStore.actions.CELL_MOUSE_DOWN(position)])
    expect(activeCellPosition).toEqual(position)
  })
})
