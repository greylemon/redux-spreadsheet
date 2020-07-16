import { IExcelState, ISheetName } from '../../@types/state'
import { nSelectActiveSheet, nSelectActiveCell } from './selectors'
import { createEditorStateFromCell } from '../../tools/cell'

export const changeSheetInPlace = (
  sheetName: ISheetName,
  state: IExcelState
): void => {
  const curActiveSheet = nSelectActiveSheet(state)

  curActiveSheet.activeCellPosition = state.activeCellPosition
  curActiveSheet.inactiveSelectionAreas = state.inactiveSelectionAreas

  state.activeSheetName = sheetName

  state.isEditMode = false
  state.isSheetNavigationOpen = false

  const newActiveSheet = nSelectActiveSheet(state)

  state.activeCellPosition = newActiveSheet.activeCellPosition
  state.inactiveSelectionAreas = newActiveSheet.inactiveSelectionAreas

  const activeCell = nSelectActiveCell(state)

  state.editorState = createEditorStateFromCell(activeCell)
}
