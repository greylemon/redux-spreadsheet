import { createSelector } from 'reselect'
import {
  getColumnOffsets,
  getRowOffsets,
  normalizeRowHeight,
  normalizeColumnWidth,
  getAreaDimensions,
} from '../../components/Excel/tools/dimensions'
import IRootStore from '../../@types/store'
import { IComputeActiveCellStyle } from '../../@types/excel/functions'
import { IPosition } from '../../@types/excel/state'
import { CSSProperties } from 'react'

export const selectUndoxExcel = (state: IRootStore) => state.Excel

export const selectExcel = createSelector(
  [selectUndoxExcel],
  (undoxExcel) => undoxExcel.present
)

// ===========================================================================
// EXCEL BASE SELECTORS
// ===========================================================================
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

export const selectActiveCellPosition = createSelector(
  [selectExcel],
  (excel) => excel.activeCellPosition
)

// ===========================================================================
// CUSTOM SELECTORS
// ===========================================================================
export const selectColumnoffsets = createSelector(
  [selectColumnWidths, selectColumnCount],
  (columnWidths, columnCount) => getColumnOffsets(columnWidths, columnCount)
)

export const selectRowOffsets = createSelector(
  [selectRowHeights, selectRowCount],
  (rowHeights, rowCount) => getRowOffsets(rowHeights, rowCount)
)

export const selectGetRowHeight = (state: IRootStore) => (index: number) =>
  createSelector([selectRowHeights], (rowHeights) =>
    normalizeRowHeight(index, rowHeights)
  )(state)

export const selectGetColumnWidth = (state: IRootStore) => (index: number) =>
  createSelector([selectColumnWidths], (columnWidths) =>
    normalizeColumnWidth(index, columnWidths)
  )(state)

// ===========================================================================
// CUSTOM SELECTOR FACTORIES
// ===========================================================================
export const selectRowDataFactory = (row: number) => (state: IRootStore) =>
  createSelector([selectData], (data) => data[row])(state)

export const selectCellFactory = (position: IPosition) => (state: IRootStore) =>
  createSelector([selectRowDataFactory(position.y)], (rowData) =>
    rowData ? rowData[position.x] : undefined
  )(state)

export const selectCellMergeFactory = (position: IPosition) => (
  state: IRootStore
) =>
  createSelector([selectCellFactory(position)], (cell) =>
    cell ? cell.merged : undefined
  )(state)

export const selectFactoryActiveCellStyles = (
  computeActiveCellStyle?: IComputeActiveCellStyle
) => (state: IRootStore) =>
  createSelector(
    [
      selectFreezeRowCount,

      selectColumnCount,
      selectRowCount,

      selectColumnWidths,
      selectRowHeights,

      selectColumnoffsets,
      selectRowOffsets,

      selectData,

      selectActiveCellPosition
    ],
    (
      freezeRowCount,

      columnCount,
      rowCount,

      columnWidths,
      rowHeights,

      columnOffsets,
      rowOffsets,

      data,

      activeCellPosition
    ) => {
      let activeCellStyle: CSSProperties

      if (computeActiveCellStyle) {
        activeCellStyle = computeActiveCellStyle(
          activeCellPosition,
          columnWidths,
          columnOffsets,
          rowHeights,
          rowOffsets,
          freezeRowCount,
          data
        )
        activeCellStyle.minHeight = activeCellStyle.height
        activeCellStyle.minWidth = activeCellStyle.width
      } else {
        let height, width, top, left

        const cellMergeArea = selectCellMergeFactory(activeCellPosition)(state)

        if (cellMergeArea) {
          const mergeDimensions = getAreaDimensions(
            cellMergeArea,
            rowOffsets,
            columnOffsets,
            columnWidths,
            rowHeights
          )

          height = mergeDimensions.height
          width = mergeDimensions.width

          top = rowOffsets[cellMergeArea.start.y]
          left = columnOffsets[cellMergeArea.start.x]
        } else {
          top = rowOffsets[activeCellPosition.y]
          left = columnOffsets[activeCellPosition.x]

          height = normalizeRowHeight(activeCellPosition.y, rowHeights)
          width = normalizeColumnWidth(activeCellPosition.x, columnWidths)
        }

        activeCellStyle = {
          top,
          left,
          height,
          width,
          minHeight: height,
          minWidth: width,
        }
      }

      activeCellStyle.maxWidth =
        columnOffsets[columnCount - 1] +
        normalizeColumnWidth(columnCount, columnWidths) -
        columnOffsets[activeCellPosition.x]
      activeCellStyle.maxHeight =
        rowOffsets[rowCount - 1] +
        normalizeRowHeight(rowCount, rowHeights) -
        rowOffsets[activeCellPosition.y]

      return activeCellStyle
    }
  )(state)
