import { CSSProperties } from 'react'
import { IRows, IColumnIndex, IRowIndex, IColumnWidthsAdjusted } from './state'
import {
  ICheckIsActiveCellInCorrectPane,
  ICheckIsAreaInRelevantPane,
  IComputeActiveCellStyle,
  IComputeSelectionAreaStyle,
} from './functions'

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
