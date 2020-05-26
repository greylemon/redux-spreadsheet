import { CSSProperties } from 'react'
import { IRows, IColumnIndex, IRowIndex } from './state'

type IItemData = {
  data: IRows
}

export interface ICell {
  data: IItemData
  style: CSSProperties
  columnIndex: IColumnIndex
  rowIndex: IRowIndex
}
