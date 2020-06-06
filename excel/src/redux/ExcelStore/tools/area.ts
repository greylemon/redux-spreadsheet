import { IPosition, IActiveCellPosition } from '../../../@types/excel/state'

export const getOrderedArea = (
  position: IPosition,
  activeCellPosition: IActiveCellPosition
) => ({
  start: {
    y: Math.min(position.y, activeCellPosition.y),
    x: Math.min(position.x, activeCellPosition.x),
  },
  end: {
    y: Math.max(position.y, activeCellPosition.y),
    x: Math.max(position.x, activeCellPosition.x),
  },
})

// export const getAllAreas = (newState) => {
//   const {
//     activeSelectionArea,
//     stagnantSelectionAreas,
//     activeCellPosition: { x, y },
//   } = newState

//   const selectionAreaCoveredCells = {
//     [y]: {
//       [x]: true,
//     },
//   }

//   const combinedSelectionArea = [...stagnantSelectionAreas]

//   if (activeSelectionArea) combinedSelectionArea.push(activeSelectionArea)

//   combinedSelectionArea.forEach(({ x1, x2, y1, y2 }) => {
//     const startRow = Math.min(y1, y2)
//     const endRow = Math.max(y1, y2)

//     const startColumn = Math.min(x1, x2)
//     const endColumn = Math.max(x1, x2)

//     for (let row = startRow; row <= endRow; row++) {
//       for (let column = startColumn; column <= endColumn; column++) {
//         if (selectionAreaCoveredCells[row]) {
//           selectionAreaCoveredCells[row][column] = true
//         } else {
//           selectionAreaCoveredCells[row] = { [column]: true }
//         }
//       }
//     }
//   })

//   return selectionAreaCoveredCells
// }

// export const getLastArea = (stagnantSelectionAreas, activeCellPosition) => {
//   let area
//   const stagnantSelectionAreasLength = stagnantSelectionAreas.length

//   if (stagnantSelectionAreasLength) {
//     area = stagnantSelectionAreas[stagnantSelectionAreasLength - 1]
//   } else {
//     const { y, x } = activeCellPosition
//     area = { y1: y, y2: y, x1: x, x2: x }
//   }

//   return area
// }
