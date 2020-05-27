import { CSSProperties } from 'react'
import { IRows, IColumnIndex, IRowIndex } from './state'
import {
  ICheckIsActiveCellInCorrectPane,
  ICheckIsRelevantArea,
  IComputeActiveCellStyle,
} from './functions'

type IItemData = {
  data: IRows
}

export interface ICell {
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
  checkIsRelevantArea: ICheckIsRelevantArea
  computeActiveCellStyle?: IComputeActiveCellStyle
}
