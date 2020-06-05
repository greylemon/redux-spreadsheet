import {
  IRows,
  IArea,
  IRange,
  IColumnIndex,
  IRowIndex,
} from '../../../@types/excel/state'
import cloneDeep from 'clone-deep'

/**
 * Sets the new area to be the smallest area which covers both newArea and mergeArea in place
 */
const changeAreaToSuperAreaInPlace = (mergeArea: IArea, newArea: IArea) => {
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
) => {
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
) => {
  const newArea = cloneDeep(area)

  for (let row = yRange.start; row <= yRange.end; row++) {
    const rowData = data[row]

    if (rowData && rowData[column] && rowData[column].merged)
      changeAreaToSuperAreaInPlace(rowData[column].merged!, newArea)
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
const getPartialSuperAreaFromArea = (area: IArea, data: IRows) => {
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
export const getEntireSuperArea = (orderedArea: IArea, data: IRows) => {
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

// export const getTabFreeSpot = ({ y, startX, endX, rowData }) => {
//   let minX = Infinity
//   let minY = Infinity
//   for (let column = startX; column <= endX; column++) {
//     const columnData = rowData[column]

//     if (columnData && columnData.merged) {
//       const { x1: mergedX1, y1: mergedY1, y2: mergedY2 } = columnData.merged

//       // top left of merge is at the same level as y
//       if (mergedY1 === y) {
//         minX = mergedX1

//         minY = y
//         break
//         // Get free space after merge
//       } else if (mergedY2 < minY) {
//         if (mergedX1 < minX) minX = mergedX1

//         minY = mergedY2 + 1
//       }
//     } else {
//       // Found regular cell -- y doesn't change
//       if (y < minY || (y === minY && column < minX)) minX = column

//       minY = y
//       break
//     }
//   }

//   return { minX, minY }
// }

// export const getShiftTabFreeSpot = ({ y, startX, endX, rowData }) => {
//   let maxX = -1
//   let maxY = -1
//   for (let column = endX; column >= startX; column--) {
//     const columnData = rowData[column]

//     if (columnData && columnData.merged) {
//       const { x1: mergedX1, y1: mergedY1 } = columnData.merged

//       if (mergedY1 >= maxY) {
//         if (mergedY1 > maxY || (mergedY1 === maxY && mergedX1 > maxX))
//           maxX = mergedX1

//         maxY = mergedY1
//       }

//       if (mergedY1 === y) break
//     } else {
//       // Found regular cell -- y doesn't change
//       maxX = column
//       maxY = y
//       break
//     }
//   }

//   return { maxX, maxY }
// }

// export const getEnterFreeSpot = ({ x, startY, endY, sheetCellData }) => {
//   let minX = Infinity
//   let minY = Infinity

//   for (let row = startY; row <= endY; row++) {
//     const rowData = sheetCellData[row]

//     if (rowData && rowData[x] && rowData[x].merged) {
//       const { x1: mergedX1, x2: mergedX2, y1: mergedY1 } = rowData[x].merged

//       if (x === mergedX1) {
//         minX = x
//         minY = mergedY1
//         break
//       } else if (mergedX2 < minX) {
//         if (mergedY1 < minY) minY = mergedY1

//         minX = mergedX2 + 1
//       }
//     } else {
//       // Found regular cell -- y doesn't change
//       if (x < minX || (x === minX && row < minY)) minY = row

//       minX = x
//       break
//     }
//   }

//   return { minX, minY }
// }

// export const getShiftEnterFreeSpot = ({ x, startY, endY, sheetCellData }) => {
//   let maxX = -1
//   let maxY = -1

//   for (let row = endY; row >= startY; row--) {
//     const rowData = sheetCellData[row]

//     if (rowData && rowData[x] && rowData[x].merged) {
//       const { x1: mergedX1, y1: mergedY1 } = rowData[x].merged

//       if (mergedX1 >= maxX) {
//         if (mergedX1 > maxX || (mergedX1 === maxX && mergedY1 > maxY))
//           maxY = mergedY1

//         maxX = mergedX1
//       }

//       if (mergedX1 === x) break
//     } else {
//       // Found regular cell -- y doesn't change
//       if (x > maxX || (x === maxX && row > maxY)) maxY = row

//       maxX = x
//       break
//     }
//   }

//   return { maxY, maxX }
// }
