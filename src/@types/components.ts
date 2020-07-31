import { CSSProperties } from 'react'
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
} from './functions'
import { ISheetRef, IGridRef } from './ref'

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
