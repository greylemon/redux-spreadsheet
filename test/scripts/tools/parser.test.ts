import { mockStore, createRootMockStore } from '../mockStore'
import { convertRawExcelToState, readFileFromPath } from '../../../src/tools/IO'
import { selectData } from '../../../src/redux/selectors/activeSheet'
import { createRootStoreFromExcelState } from '../../../src/redux/tools/state'

import { ExcelActions } from '../../../src/redux/store'
import IRootStore from '../../../src/@types/store'

describe('Parser', () => {
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    store = createRootMockStore()
  })

  // https://stackoverflow.com/a/46568146
  describe('Parse formula', () => {
    it('Load workbook', async () => {
      const file = require.resolve('../../../samples/formulas.xlsx')
      const fileJSON = require.resolve('../../../samples/formulas.json')
      const excelState = await convertRawExcelToState(file)

      const state = createRootStoreFromExcelState(excelState)

      const fileExcelData = selectData(state)

      const JSONBuffer = await readFileFromPath(fileJSON)
      const JSONContent: IRootStore = JSON.parse(JSONBuffer.toString())

      expect(fileExcelData).toEqual(selectData(JSONContent))

      store.dispatch(ExcelActions.UPDATE_STATE(excelState))

      const data = selectData(store.getState())
      expect(data).toEqual(selectData(JSONContent))
    })
  })
})
