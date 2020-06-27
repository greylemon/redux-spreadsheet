import { IPosition, IRows, IExcelState } from '../../@types/state'

// //////////////////////////////////////////////////////////////
// FUNCTIONS TO FETCH EXCEL DATA FROM REDUCER
// //////////////////////////////////////////////////////////////
export const nSelectSheetsMap = (excel: IExcelState) => excel.sheetsMap
export const nSelectActiveSheetName = (excel: IExcelState) =>
  excel.activeSheetName
export const nSelectActiveSheet = (excel: IExcelState) =>
  nSelectSheetsMap(excel)[nSelectActiveSheetName(excel)]

export const nSelectCell = (data: IRows, position: IPosition) =>
  data[position.y] ? data[position.y][position.x] : undefined

export const nSelectMergeCell = (data: IRows, position: IPosition) => {
  const cell = nSelectCell(data, position)

  return cell ? cell.merged : undefined
}