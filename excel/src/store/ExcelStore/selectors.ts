import { createSelector } from 'reselect'
import {
  getColumnOffsets,
  getRowOffsets,
} from '../../components/Excel/tools/dimensions'
import IRootStore from '../../@types/store'

export const selectUndoxExcel = (state: IRootStore) => state.Excel

export const selectExcel = createSelector(
  [selectUndoxExcel],
  (undoxExcel) => undoxExcel.present
)

export const selectColumnWidths = createSelector(
  [selectExcel],
  (excel) => excel.columnWidths
)

export const selectData = createSelector([selectExcel], (excel) => excel.data)

export const selectColumnCount = createSelector(
  [selectExcel],
  (excel) => excel.columnCount
)

export const selectRowHeights = createSelector(
  [selectExcel],
  (excel) => excel.rowHeights
)

export const selectRowCount = createSelector(
  [selectExcel],
  (excel) => excel.rowCount
)

export const selectIsEditMode = createSelector(
  [selectExcel],
  (excel) => excel.isEditMode
)

export const selectFreezeRowCount = createSelector(
  [selectExcel],
  (excel) => excel.freezeRowCount
)

export const selectFreezeColumnCount = createSelector(
  [selectExcel],
  (excel) => excel.freezeColumnCount
)

export const selectColumnoffsets = createSelector(
  [selectColumnWidths, selectColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [selectRowHeights, selectRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)
