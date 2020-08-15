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
import { getEndDimension } from '../../tools/dimensions'

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

const increase = (
  dimension: number,
  start: number,
  end: number,
  freeze: number
): number => {
  let newStart: number

  if (dimension === freeze) {
    newStart = freeze + 1
  } else if (dimension >= end) {
    newStart = start + 1
  } else {
    newStart = start
  }

  return newStart
}

const decrease = (dimension: number, start: number, freeze: number) =>
  dimension <= start && dimension > freeze && start > freeze ? start - 1 : start

export const decreaseWithState = (
  state: IRootStore,
  selectDimension: any,
  selectStart: any,
  selectTableFreeze: any
) => {
  const dimension = selectDimension(state)
  const start = selectStart(state)
  const tableFreeze = selectTableFreeze(state)

  return decrease(dimension, start, tableFreeze)
}

export const increaseWithState = (
  state: IRootStore,
  selectDimension: any,
  selectStart: any,
  selectFreeze: any,
  selectOffsets: any,
  selectTableDimensionCount: any,
  screenDimension: number
) => {
  const dimension = selectDimension(state)
  const start = selectStart(state)
  const offsets = selectOffsets(state)
  const freeze = selectFreeze(state)
  const tableDimensionCount = selectTableDimensionCount(state)
  const end = getEndDimension(
    start,
    offsets,
    freeze,
    screenDimension,
    tableDimensionCount
  )

  return increase(dimension, start, end, freeze)
}
