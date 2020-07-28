import {
  IRows,
  IExcelState,
  ISheetsMap,
  ISheet,
  ICell,
  IArea,
  IStyles,
  IMerged,
} from '../../@types/state'
import { getMergeArea } from './merge'

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

  return data[y] && data[y][x] ? data[y][x] : undefined
}

export const nSelectActiveCellStyle = (
  state: IExcelState
): IStyles | undefined => {
  const activeCell = nSelectActiveCell(state)

  return activeCell ? activeCell.style : undefined
}

export const nSelectMerged = (state: IExcelState): IMerged | undefined => {
  const cell = nSelectActiveCell(state)

  return cell ? cell.merged : undefined
}

export const nSelectMergeCellArea = (state: IExcelState): IArea | undefined => {
  const merged = nSelectMerged(state)

  return merged
    ? getMergeArea(nSelectActiveSheetData(state), merged)
    : undefined
}

export const selectPosition = (state: IExcelState) => {
  const merged = nSelectMerged(state)

  return merged
    ? getMergeArea(nSelectActiveSheetData(state), merged).start
    : state.activeCellPosition
}
