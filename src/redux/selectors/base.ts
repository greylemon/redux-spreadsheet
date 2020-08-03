import { createSelector } from '@reduxjs/toolkit'
import IRootStore from '../../@types/store'
import { IExcelState } from '../../@types/state'

export const selectExcel = (undoxExcel: IRootStore): IExcelState =>
  undoxExcel.present

export const selectTitle = createSelector([selectExcel], (excel) => excel.title)

export const selectIsEditMode = createSelector(
  [selectExcel],
  (excel) => excel.isEditMode
)

export const selectCellEditorState = createSelector(
  [selectExcel],
  (excel) => excel.cellEditorState
)

export const selectTitleEditorState = createSelector(
  [selectExcel],
  (excel) => excel.titleEditorState
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

export const selectSelectionAreaIndex = createSelector(
  [selectExcel],
  (excel) => excel.selectionAreaIndex
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

export const selectLastVisitedCell = createSelector(
  [selectExcel],
  (excel) => excel.lastVisitedCell
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

export const selectScrollOffsetX = createSelector(
  [selectScrollOffset],
  (scrollOffset) => scrollOffset.x
)

export const selectScrollOffsetY = createSelector(
  [selectScrollOffset],
  (scrollOffset) => scrollOffset.y
)

export const selectTopLeftPosition = createSelector(
  [selectExcel],
  (excel) => excel.topLeftPosition
)

export const selectTopLeftPositionX = createSelector(
  [selectTopLeftPosition],
  (topLeftPosition) => topLeftPosition.x
)

export const selectTopLeftPositionY = createSelector(
  [selectTopLeftPosition],
  (topLeftPosition) => topLeftPosition.y
)

export const selectIsRowDrag = createSelector(
  [selectExcel],
  (excel) => excel.isRowDrag
)

export const selectIsColumnDrag = createSelector(
  [selectExcel],
  (excel) => excel.isColumnDrag
)

export const selectDragRowOffset = createSelector(
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

export const selectSheetDimensionsX = createSelector(
  [selectSheetDimensions],
  (sheetDimensions) => sheetDimensions.x
)

export const selectSheetDimensionsY = createSelector(
  [selectSheetDimensions],
  (sheetDimensions) => sheetDimensions.y
)

export const selectScrollHorizontal = createSelector(
  [selectExcel],
  (excel) => excel.scrollHorizontal
)

export const selectScrollVertical = createSelector(
  [selectExcel],
  (excel) => excel.scrollVertical
)
