import { CSSProperties } from 'react'
import {
  IRows,
  IRowOffsets,
  IPosition,
  IFreezeColumnCount,
  IFreezeRowCount,
  IArea,
  IColumnWidths,
  IRowHeights,
  IColumnOffsets,
  ISelectionArea,
} from './state'

export interface IComputeActiveCellStyle {
  (
    position: IPosition,
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowheights: IRowHeights,
    rowoffsets: IRowOffsets,
    freezeRowCount: IFreezeRowCount,
    data: IRows
  ): CSSProperties
}

export interface IComputeSelectionAreaStyle {
  (
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    selectionArea?: ISelectionArea
  ): CSSProperties
}

export interface ICheckIsAreaInRelevantPane {
  (
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    area?: ISelectionArea
  ): boolean
}

export interface ICheckIsActiveCellInCorrectPane {
  (
    position: IPosition,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}
