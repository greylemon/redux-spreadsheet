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

  if (merged) {
    let mergedArea: IArea

    if (merged.area) {
      mergedArea = merged.area
    } else {
      const data = nSelectActiveSheetData(state)
      const { parent } = merged

      mergedArea = data[parent.y][parent.x].merged.area
    }

    return mergedArea
  }

  return undefined
}
