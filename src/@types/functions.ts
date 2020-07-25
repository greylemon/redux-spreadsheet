import { CSSProperties } from 'react'
import {
  IRows,
  IRowOffsets,
  IPosition,
  IFreezeColumnCount,
  IFreezeRowCount,
  IColumnWidths,
  IRowHeights,
  IColumnOffsets,
  ISelectionArea,
  IExcelState,
  ISheetName,
  IOffset,
  IColumnIndex,
  IColumnWidth,
  IRowHeight,
  IRowIndex,
  IInlineStyles,
} from './state'

export interface IComputeActiveCellStyle {
  (
    position: IPosition,
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
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
    area: ISelectionArea
  ): boolean
}

export interface ICheckIsActiveCellInCorrectPane {
  (
    position: IPosition,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}

export type IGetColumnWidth = {
  (index: IColumnIndex): IColumnWidth
}

export type IGetRowHeight = {
  (index: IRowIndex): IRowHeight
}

export type ICheckIsDragColumnOffsetInCorrectPane = {
  (
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    offset?: IOffset,
    columnOffsets?: IColumnOffsets,
    getColumnWidth?: IGetColumnWidth,
    scrollOffsetX?: IOffset
  ): boolean
}

export type ICheckIsDragRowOffsetInCorrectPane = {
  (
    freezeCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    offset?: IOffset,
    rowOffsets?: IRowOffsets,
    getRowHeight?: IGetRowHeight,
    scrollOffsetY?: IOffset
  ): boolean
}

export interface IHandleSave {
  (excelState: IExcelState): void
}

export interface IHandleSheetPress {
  (sheetName: ISheetName): void
}

export type IInlineStyleEqFn = (style: IInlineStyles) => boolean

export type ISetInlineStyleFn = (style: IInlineStyles) => void
