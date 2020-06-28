import {
  IPosition,
  IRows,
  IExcelState,
  ISheetsMap,
  ISheet,
  ICell,
  IArea,
} from '../../@types/state'

// //////////////////////////////////////////////////////////////
// FUNCTIONS TO FETCH EXCEL DATA FROM REDUCER
// //////////////////////////////////////////////////////////////
export const nSelectSheetsMap = (excel: IExcelState): ISheetsMap =>
  excel.sheetsMap
export const nSelectActiveSheetName = (excel: IExcelState): string =>
  excel.activeSheetName
export const nSelectActiveSheet = (excel: IExcelState): ISheet =>
  nSelectSheetsMap(excel)[nSelectActiveSheetName(excel)]

export const nSelectCell = (
  data: IRows,
  position: IPosition
): ICell | undefined =>
  data[position.y] ? data[position.y][position.x] : undefined

export const nSelectMergeCell = (
  data: IRows,
  position: IPosition
): IArea | undefined => {
  const cell = nSelectCell(data, position)

  return cell ? cell.merged : undefined
}
