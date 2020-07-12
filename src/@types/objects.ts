import { IPosition, IAreaRange, ISheetName } from './state'

export type IFormulaMap = {
  // sheet name
  [key: string]: {
    // row
    [key: string]: {
      // column
      [key: string]: string
    }
  }
}

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
