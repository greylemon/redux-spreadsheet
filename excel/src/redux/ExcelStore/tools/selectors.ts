import { IPosition, IRows, IRowIndex } from '../../../@types/excel/state'

// //////////////////////////////////////////////////////////////
// FUNCTIONS TO FETCH EXCEL DATA FROM REDUCER
// //////////////////////////////////////////////////////////////
export const nSelectCell = (data: IRows, position: IPosition) =>
  data[position.y] ? data[position.y][position.x] : undefined

export const nSelectMergeCell = (data: IRows, position: IPosition) => {
  const cell = nSelectCell(data, position)

  return cell ? cell.merged : undefined
}
