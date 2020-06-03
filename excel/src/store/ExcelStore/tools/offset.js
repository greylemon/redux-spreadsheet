// import { isObjectEmpty } from '../../../../../tools/misc'

// export const offsetObjectAtIndex = (data, start, offset) => {
//   const newData = {}
//   const startData = data[start]

//   const end = start + offset

//   for (const offsetParam in data) {
//     const paramData = data[offsetParam]
//     if (offsetParam >= start && paramData) {
//       const newOffsetParam = Number(offsetParam) + offset
//       newData[newOffsetParam] = paramData
//     } else {
//       newData[offsetParam] = data[offsetParam]
//     }
//   }

//   if (startData !== undefined) {
//     for (let i = start; i < end; i++) newData[i] = startData
//   }

//   return newData
// }

// export const offsetSheetCellRowDataAtIndex = (sheetCellData, start, offset) => {
//   const newData = {}
//   const startData = sheetCellData[start]
//   const template = {}

//   const end = start + offset

//   for (const column in startData) {
//     if (startData[column] && startData[column].styles)
//       template[column] = {
//         type: 'normal',
//         styles: { ...startData[column].styles },
//       }
//   }

//   // Offset data downwards
//   for (const row in sheetCellData) {
//     const rowData = sheetCellData[row]
//     if (start <= row && rowData) {
//       const newRowOffset = Number(row) + offset
//       newData[newRowOffset] = rowData
//     } else {
//       newData[row] = { ...sheetCellData[row] }
//     }
//   }

//   if (startData !== undefined) {
//     for (let i = start; i < end; i++) newData[i] = template
//   }

//   return newData
// }

// export const offsetSheetCellColumnDataAtIndex = (
//   sheetCellData,
//   start,
//   offset
// ) => {
//   // Get the template column data to apply to inserted columns
//   const template = {}
//   const newData = {}

//   const end = start + offset

//   // Offset data rightwards
//   for (const row in sheetCellData) {
//     const columns = sheetCellData[row]

//     if (newData[row] === undefined) newData[row] = {}

//     for (const column in columns) {
//       const columnData = columns[column]
//       if (start <= column && columnData) {
//         if (start == column && columnData.styles)
//           template[row] = { styles: { ...columnData.styles } }

//         const newColumnOffset = Number(column) + offset
//         newData[row][newColumnOffset] = sheetCellData[row][column]
//       } else {
//         newData[row][column] = sheetCellData[row][column]
//       }
//     }
//   }

//   if (!isObjectEmpty(template)) {
//     for (const row in newData) {
//       for (let i = start; i < end; i++) newData[row][i] = template[row]
//     }
//   }

//   return newData
// }

// export const getInsertData = (
//   parameterString,
//   stagnantSelectionAreas,
//   activeCellPosition
// ) => {
//   let insertStart
//   let insertCount

//   const stagnantSelectionAreasLength = stagnantSelectionAreas.length

//   if (stagnantSelectionAreasLength) {
//     const {
//       [`${parameterString}1`]: pos1,
//       [`${parameterString}2`]: pos2,
//     } = stagnantSelectionAreas[stagnantSelectionAreasLength - 1]

//     insertStart = Math.min(pos1, pos2)
//     insertCount = Math.abs(pos2 - pos1) + 1
//   } else {
//     const { [parameterString]: pos } = activeCellPosition

//     insertStart = pos
//     insertCount = 1
//   }

//   return { insertStart, insertCount }
// }
