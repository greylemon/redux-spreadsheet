import { IExcelState } from '../../@types/state'
import { createValueFromEditorState, updateActiveCellRef } from '../..'
import { nSelectActiveSheet } from './selectors'

export const updateActiveCellValueInPlace = (state: IExcelState): void => {
  const cellValue = createValueFromEditorState(state.editorState)

  if (cellValue) {
    const activeSheet = nSelectActiveSheet(state)
    const { x, y } = state.activeCellPosition

    if (!activeSheet.data[y]) activeSheet.data[y] = {}
    if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

    activeSheet.data[y][x] = { ...activeSheet.data[y][x], ...cellValue }
  }

  updateActiveCellRef(state)
}
