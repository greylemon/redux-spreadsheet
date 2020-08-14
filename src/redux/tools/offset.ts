import { IOffset, IPosition } from '../../@types/state'
import IRootStore from '../../@types/store'
import {
  selectActiveCellPosition,
  selectTopLeftPosition,
} from '../selectors/base'
import {
  selectRowOffsets,
  selectColumnOffsets,
  selectTableFreezeColumnCount,
  selectTableFreezeRowCount,
} from '../selectors/custom'

const computeOffset = (
  dimension: number,
  start: number,
  freezeCount: number,
  offsets: IOffset[]
) => {
  let left = offsets[dimension]
  if (dimension > freezeCount) left += offsets[freezeCount] - offsets[start]
  return left
}

export const computeInputPosition = (state: IRootStore): IPosition => {
  const activeCellPosition = selectActiveCellPosition(state)
  const topLeftPosition = selectTopLeftPosition(state)
  const rowOffsets = selectRowOffsets(state)
  const columnOffsets = selectColumnOffsets(state)

  const tableFreezeColumnCount = selectTableFreezeColumnCount(state)
  const tableFreezeRowCount = selectTableFreezeRowCount(state)

  return {
    x: computeOffset(
      activeCellPosition.x,
      topLeftPosition.x,
      tableFreezeColumnCount,
      columnOffsets
    ),
    y: computeOffset(
      activeCellPosition.y,
      topLeftPosition.y,
      tableFreezeRowCount,
      rowOffsets
    ),
  }
}
