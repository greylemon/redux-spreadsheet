import { createSelector } from 'reselect'
import IRootStore from '../../@types/store'
import { IExcelState } from '../../@types/state'

export const selectExcel = (undoxExcel: IRootStore): IExcelState =>
  undoxExcel.present

export const selectIsEditMode = createSelector(
  [selectExcel],
  (excel) => excel.isEditMode
)

export const selectCellEditorState = createSelector(
  [selectExcel],
  (excel) => excel.editorState
)

export const selectSheetNames = createSelector(
  [selectExcel],
  (excel) => excel.sheetNames
)

export const selectActiveSheetName = createSelector(
  [selectExcel],
  (excel) => excel.activeSheetName
)

export const selectSheetNameText = createSelector(
  [selectExcel],
  (excel) => excel.sheetNameText
)

export const selectIsSheetNameEdit = createSelector(
  [selectExcel],
  (excel) => excel.isSheetNameEdit
)

export const selectIsSheetNavigationOpen = createSelector(
  [selectExcel],
  (excel) => excel.isSheetNavigationOpen
)

export const selectSheetsMap = createSelector(
  [selectExcel],
  (excel) => excel.sheetsMap
)

export const selectSelectionArea = createSelector(
  [selectExcel],
  (excel) => excel.selectionArea
)

export const selectActiveCellPosition = createSelector(
  [selectExcel],
  (excel) => excel.activeCellPosition
)

export const selectActiveCellPositionRow = createSelector(
  [selectActiveCellPosition],
  (activeCellPosition) => activeCellPosition.y
)

export const selectActiveCellPositionColumn = createSelector(
  [selectActiveCellPosition],
  (activeCellPosition) => activeCellPosition.x
)

export const selectInactiveSelectionAreas = createSelector(
  [selectExcel],
  (excel) => excel.inactiveSelectionAreas
)

export const selectResults = createSelector(
  [selectExcel],
  (excel) => excel.results
)

export const selectIsSelectionMode = createSelector(
  [selectExcel],
  (excel) => excel.isSelectionMode
)

export const selectScrollOffset = createSelector(
  [selectExcel],
  (excel) => excel.scrollOffset
)

export const selectIsRowDrag = createSelector(
  [selectExcel],
  (excel) => excel.isRowDrag
)

export const selectIsColumnDrag = createSelector(
  [selectExcel],
  (excel) => excel.isColumnDrag
)

export const selectDragRowPosition = createSelector(
  [selectExcel],
  (excel) => excel.dragRowOffset
)

export const selectDragRowIndex = createSelector(
  [selectExcel],
  (excel) => excel.dragRowIndex
)

export const selectDragColumnOffset = createSelector(
  [selectExcel],
  (excel) => excel.dragColumnOffset
)

export const selectDragColumnIndex = createSelector(
  [selectExcel],
  (excel) => excel.dragColumnIndex
)

export const selectSheetDimensions = createSelector(
  [selectExcel],
  (excel) => excel.sheetDimensions
)
