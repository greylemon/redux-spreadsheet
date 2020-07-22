import {
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
export const nSelectSheetsMap = (state: IExcelState): ISheetsMap =>
  state.sheetsMap

export const nSelectActiveSheetName = (state: IExcelState): string =>
  state.activeSheetName

export const nSelectActiveSheet = (state: IExcelState): ISheet =>
  nSelectSheetsMap(state)[nSelectActiveSheetName(state)]

export const nSelectActiveSheetData = (state: IExcelState): IRows =>
  nSelectActiveSheet(state).data

export const nSelectActiveCell = (state: IExcelState): ICell | undefined => {
  const data = nSelectActiveSheetData(state)

  const { x, y } = state.activeCellPosition

  if (data[y] && data[y][x]) return data[y][x]
}

export const nSelectMergeCell = (state: IExcelState): IArea | undefined => {
  const cell = nSelectActiveCell(state)

  return cell ? cell.merged : undefined
}
