import { CSSProperties } from 'react'
import {
  IRows,
  IColumnIndex,
  IRowIndex,
  IColumnWidthsAdjusted,
  IExcelState,
} from './state'
import {
  ICheckIsActiveCellInCorrectPane,
  ICheckIsAreaInRelevantPane,
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
  IHandleSave,
} from './functions'

export type ExcelComponentProps = {
  /** Initial excel state */
  initialState?: IExcelState
  /** Inline react styles */
  style?: CSSProperties
  /** Determines whether Excel uses react-router */
  isRouted?: boolean
  /** Function to process save events */
  handleSave?: IHandleSave
}

export type IFormulaResult = {
  [key: string]: {
    [key: string]: number | string
  }
}

export type IItemData = {
  data: IRows
  columnWidthsAdjusted: IColumnWidthsAdjusted
  formulaResults: IFormulaResult
  getRowHeight: (index: number) => number
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
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  computeActiveCellStyle?: IComputeActiveCellStyle
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
