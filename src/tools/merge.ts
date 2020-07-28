import cloneDeep from 'clone-deep'
import { IRows, IArea, IRange, IColumnIndex, IRowIndex } from '../@types/state'
import { TYPE_MERGE } from '../constants/types'
import { checkIsAreaEqualOtherArea } from './area'

/**
 * Sets the new area to be the smallest area which covers both newArea and mergeArea in place
 */
const changeAreaToSuperAreaInPlace = (
  mergeArea: IArea,
  newArea: IArea
): void => {
  const { start, end } = mergeArea

  if (newArea.start.x < newArea.end.x) {
    if (start.x < newArea.start.x) newArea.start.x = start.x
    if (end.x > newArea.end.x) newArea.end.x = end.x
  } else {
    if (start.x < newArea.end.x) newArea.end.x = start.x
    if (end.x > newArea.start.x) newArea.start.x = end.x
  }

  if (newArea.start.y < newArea.end.y) {
    if (start.y < newArea.start.y) newArea.start.y = start.y
    if (end.y > newArea.end.y) newArea.end.y = end.y
  } else {
    if (start.y < newArea.end.y) newArea.end.y = start.y
    if (end.y > newArea.start.y) newArea.start.y = end.y
  }
}

/**
 * Gets the `partial` super area from a range of column on a single row
 */
const getPartialSuperAreaFromColumnRange = (
  xRange: IRange,
  area: IArea,
  row: IRowIndex,
  data: IRows
): IArea => {
  const newArea = cloneDeep(area)

  const rowData = data[row]

  for (let column = xRange.start; column <= xRange.end; column += 1) {
    const cellData = rowData[column]

    if (cellData && cellData.merged) {
      let mergedArea: IArea
      if (cellData.type === TYPE_MERGE) {
        const { parent } = cellData.merged
        mergedArea = data[parent.y][parent.x].merged.area
      } else {
        mergedArea = cellData.merged.area
      }

      changeAreaToSuperAreaInPlace(mergedArea, newArea)
    }
  }

  return newArea
}

/**
 * Gets the partial area from a range of rows on a single column
 */
const getPartialSuperAreaFromRowRange = (
  yRange: IRange,
  area: IArea,
  column: IColumnIndex,
  data: IRows
): IArea => {
  const newArea = cloneDeep(area)

  for (let row = yRange.start; row <= yRange.end; row += 1) {
    const rowData = data[row]

    if (rowData && rowData[column]) {
      const cellData = rowData[column]

      if (cellData.merged) {
        let mergedArea: IArea

        if (cellData.type === TYPE_MERGE) {
          const { parent } = cellData.merged
          mergedArea = data[parent.y][parent.x].merged.area
        } else {
          mergedArea = cellData.merged.area
        }

        changeAreaToSuperAreaInPlace(mergedArea, newArea)
      }
    }
  }

  return newArea
}

/**
 * Expands the area by capturing merged areas in the area.
 *
 * Note that only merged areas within the area are observed. As a result, this is only a partial expansion
 * in some cases, as the new expanded areas are not observed.
 *
 * Use getEntireSuperArea if you need the full area
 */
const getPartialSuperAreaFromArea = (area: IArea, data: IRows): IArea => {
  const { start, end } = area

  let newArea = cloneDeep(area)

  const top = data[start.y]
  const bottom = data[end.y]

  const horizontalRange: IRange = {
    start: Math.min(newArea.start.x, newArea.end.x),
    end: Math.max(newArea.start.x, newArea.end.x),
  }
  const verticalContainedRange: IRange = {
    start: Math.min(newArea.start.y, newArea.end.y) + 1,
    end: Math.max(newArea.start.y, newArea.end.y) - 1,
  }

  if (top)
    newArea = getPartialSuperAreaFromColumnRange(
      horizontalRange,
      newArea,
      start.y,
      data
    )

  // Bottom might be the same as top (1 row)
  if (bottom && start.y !== end.y)
    newArea = getPartialSuperAreaFromColumnRange(
      horizontalRange,
      newArea,
      end.y,
      data
    )

  // Do not need to check edges because top and bottom covers those already
  newArea = getPartialSuperAreaFromRowRange(
    verticalContainedRange,
    newArea,
    start.x,
    data
  )

  // left might be the same as right (1 column)
  if (start.x !== end.x)
    newArea = getPartialSuperAreaFromRowRange(
      verticalContainedRange,
      newArea,
      end.x,
      data
    )

  return newArea
}

/**
 * Gets the maximum area which contains the overlapping area expansion, starting from ordered area.
 *
 * Ordered area represents an area which is ordered: start represents min values, end represents max values
 */
export const getEntireSuperArea = (orderedArea: IArea, data: IRows): IArea => {
  let subArea = cloneDeep(orderedArea)
  let superArea = getPartialSuperAreaFromArea(subArea, data)

  while (!checkIsAreaEqualOtherArea(superArea, subArea)) {
    subArea = superArea
    superArea = getPartialSuperAreaFromArea(superArea, data)
  }

  return superArea
}
