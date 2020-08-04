import { CSSProperties, FunctionComponent } from 'react'
import {
  IRows,
  IColumnIndex,
  IRowIndex,
  IColumnWidthsAdjusted,
  IExcelState,
  IRowResults,
  IRowOffsets,
  IColumnOffsets,
} from './state'
import {
  ICheckIsActiveCellInCorrectPane,
  ICheckIsAreaInRelevantPane,
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  IHandleSave,
  IGetRowHeight,
  IGetColumnWidth,
} from './functions'
import { ISheetRef, IGridRef } from './ref'
import { IViewWidths } from './objects'

export type ExcelComponentProps = {
  /** Initial excel state */
  initialState?: IExcelState
  /** Inline react styles */
  style?: CSSProperties
  /** Enables active sheet name routing using react-router */
  isRouted?: boolean
  /** Disables the toolbar */
  isToolBarDisabled?: boolean
  /** Function to process save events */
  handleSave?: IHandleSave
}

export type IItemData = {
  data: IRows
  columnWidthsAdjusted: IColumnWidthsAdjusted
  sheetResults: IRowResults
  cellLayering: number[][]
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
}

export type ICanvasItemData = {
  data: IRows
  sheetResults: IRowResults
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  viewWidths: IViewWidths
}

export interface ICellProps {
  data: IItemData
  style: CSSProperties
  columnIndex: IColumnIndex
  rowIndex: IRowIndex
}

export interface IActiveCellProps {
  computeActiveCellStyle?: IComputeActiveCellStyle
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
}

export interface IEditorCellProps {
  style: CSSProperties
}

export interface INormalActiveCellProps {
  style: CSSProperties
}

export interface ICommonPaneProps {
  type: 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
}

export interface ISelectionAreaProps {
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
}

export interface IInactiveSelectionAreasComponentsProps {
  inactiveSelectionAreasStyle: Array<CSSProperties>
}

export interface IInactiveSelectionAreasProps {
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
}

export type ISheetProps = {
  sheetRef: ISheetRef
  gridRef: IGridRef
}

export type ICanvasCellProps = {
  x: number
  y: number
  width: number
  height: number
  columnIndex: number
  rowIndex: number
  data: ICanvasItemData
}

export type ICanvasCellComponentProps = {
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  columnIndex: number
  rowIndex: number
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  data: ICanvasItemData
}

export type IGenericLayerProps = {
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
  rowStartBound: number
  columnStartBound: number
  data: ICanvasItemData
}

export type IGenergicPaneProps = {
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
  rowStartBound: number
  columnStartBound: number
  CellComponent: FunctionComponent<ICanvasCellProps>
  data: ICanvasItemData
}

export type ITextLayerProps = {
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
  CellComponent: FunctionComponent<any>
  data: ICanvasItemData
  rowStartBound: number
  columnStartBound: number
}
