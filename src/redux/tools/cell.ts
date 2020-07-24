import { IExcelState } from '../../@types/state'
import { updateActiveCellRef } from '../../tools'
import { nSelectActiveSheet, nSelectActiveCell } from './selectors'
import { createValueFromCellAndEditorState } from '../../tools'

export const updateActiveCellValueInPlace = (state: IExcelState): void => {
  const cellValue = createValueFromCellAndEditorState(
    nSelectActiveCell(state),
    state.editorState
  )

  if (cellValue) {
    const activeSheet = nSelectActiveSheet(state)
    const { x, y } = state.activeCellPosition

    if (!activeSheet.data[y]) activeSheet.data[y] = {}
    if (!activeSheet.data[y][x]) activeSheet.data[y][x] = {}

    activeSheet.data[y][x] = { ...activeSheet.data[y][x], ...cellValue }
  }

  updateActiveCellRef(state)
}
