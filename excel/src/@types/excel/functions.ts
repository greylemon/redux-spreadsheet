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

export interface ICheckIsActiveCellInCorrectPane {
  (
    position: IPosition,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}

export interface ICheckIsRelevantArea {
  (
    area: IArea,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}
