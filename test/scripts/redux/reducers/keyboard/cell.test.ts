import { createRootMockStore, mockStore } from '../../../mockStore'
import { ExcelActions, initialExcelState } from '../../../../../src/redux/store'
import {
  selectColumnCount,
  selectRowCount,
  selectData,
} from '../../../../../src/redux/selectors/activeSheet'
import {
  selectActiveCellPositionRow,
  selectActiveCellPositionColumn,
} from '../../../../../src/redux/selectors/base'
import cloneDeep from 'clone-deep'
import { mockState } from '../../../mockState'
import { createEditorStateFromText } from '../../../../../src/tools/text'
import { TYPE_TEXT } from '../../../../../src/constants/types'

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

  describe('Cell delete', () => {
    it('Active cell', () => {
      const text = 'Value to delete'
      const state = cloneDeep(initialExcelState)
      state.editorState = createEditorStateFromText(text)
      state.isEditMode = true

      store.dispatch(ExcelActions.UPDATE_STATE(state))

      store.dispatch(ExcelActions.CELL_MOUSE_DOWN({ x: 1, y: 2 }))

      const state2 = store.getState()

      const cell = selectData(state2)[1][1]

      expect(cell.type).toEqual(TYPE_TEXT)
      expect(cell.type).toEqual

      store.dispatch(ExcelActions.CELL_MOUSE_DOWN({ x: 1, y: 1 }))
      store.dispatch(ExcelActions.CELL_KEY_DELETE())

      const cell2 = selectData(store.getState())[1][1]
      expect(cell2.type).toEqual(TYPE_TEXT)
      expect(cell2.value).toBe(undefined)
    })
  })
})
