import { IPosition, IAreaRange, ISheetName } from './state'

export type ICellRefMapData = {
  positions: IPosition[]
  areaRanges: IAreaRange[]
}

export type ICellRefMap = {
  [key: string]: ICellRefMapData
}

export type IVisitedColumn = Set<number>

export type IVisitedRow = {
  [key: string]: IVisitedColumn
}

export type IVisited = {
  [key: string]: IVisitedRow
}

export type IAddressReference = {
  sheetName: ISheetName
  position: IPosition
}

export type ICellMapSet = { [key: string]: Set<number> }
