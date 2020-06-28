import {
  IRows,
  IArea,
  IRange,
  IColumnIndex,
  IRowIndex,
} from '../../@types/state'
import cloneDeep from 'clone-deep'

/**
 * Sets the new area to be the smallest area which covers both newArea and mergeArea in place
 */
const changeAreaToSuperAreaInPlace = (
  mergeArea: IArea,
  newArea: IArea
): void => {
  const { start, end } = mergeArea

  const minMergedX = Math.min(start.x, end.x)
  const maxMergedX = Math.max(start.x, end.x)
  const minMergedY = Math.min(start.y, end.y)
  const maxMergedY = Math.max(start.y, end.y)

  if (minMergedX < newArea.start.x) newArea.start.x = minMergedX
  if (minMergedY < newArea.start.y) newArea.start.y = minMergedY
  if (maxMergedX > newArea.end.x) newArea.end.x = maxMergedX
  if (maxMergedY > newArea.end.y) newArea.end.y = maxMergedY
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

  for (let column = xRange.start; column <= xRange.end; column++) {
    const cellData = rowData[column]

    if (cellData && cellData.merged)
      changeAreaToSuperAreaInPlace(cellData.merged, newArea)
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

  for (let row = yRange.start; row <= yRange.end; row++) {
    const rowData = data[row]

    if (rowData && rowData[column]) {
      const mergedArea = rowData[column].merged
      if (mergedArea) changeAreaToSuperAreaInPlace(mergedArea, newArea)
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

  if (top)
    newArea = getPartialSuperAreaFromColumnRange(
      { start: newArea.start.x, end: newArea.end.x },
      newArea,
      start.y,
      data
    )

  // Bottom might be the same as top (1 row)
  if (bottom && start.y !== end.y)
    newArea = getPartialSuperAreaFromColumnRange(
      { start: newArea.start.x, end: newArea.end.x },
      newArea,
      end.y,
      data
    )

  // Do not need to check edges because top and bottom covers those already
  newArea = getPartialSuperAreaFromRowRange(
    { start: newArea.start.y + 1, end: newArea.end.y - 1 },
    newArea,
    start.x,
    data
  )

  // left might be the same as right (1 column)
  if (start.x !== end.x)
    getPartialSuperAreaFromRowRange(
      { start: newArea.start.y + 1, end: newArea.end.y - 1 },
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

  while (
    superArea.start.x !== subArea.start.x ||
    superArea.end.x !== subArea.end.x ||
    superArea.start.y !== subArea.start.y ||
    superArea.end.y !== subArea.end.y
  ) {
    subArea = superArea
    superArea = getPartialSuperAreaFromArea(superArea, data)
  }

  return superArea
}
