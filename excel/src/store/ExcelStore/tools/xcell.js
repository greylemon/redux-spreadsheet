// import {
//   convertRichTextToEditorValue,
//   convertTextToEditorValue,
//   convertEditorValueToText,
//   convertEditorValueToRichText,
//   createEmptyEditorValue,
//   CustomEditor,
// } from '../../../../../tools/slate'

// import { getCellData } from '../../../../../tools/excel'

// import { isObjectEmpty } from '../../../../../tools/misc'

// import { scrollTo } from './scroll'

// export const updateActiveCellPosition = ({
//   newState,
//   newY,
//   newX,
//   shouldScroll = true,
// }) => {
//   const {
//     activeCellInputData: { cellEditor, formulaEditor },
//     sheetCellData,
//   } = newState

//   const cellData =
//     sheetCellData[newY] && sheetCellData[newY][newX]
//       ? sheetCellData[newY][newX]
//       : {}

//   const { type, value, formula } = cellData

//   let cellValue
//   let formulaValue

//   if (type === 'rich-text') {
//     cellValue = convertRichTextToEditorValue(value)
//     formulaValue = convertRichTextToEditorValue(value)
//   } else {
//     if (value) {
//       cellValue = convertTextToEditorValue(formula ? `=${formula}` : value)
//       formulaValue = convertTextToEditorValue(formula ? `=${formula}` : value)
//     } else {
//       cellValue = createEmptyEditorValue()
//       formulaValue = createEmptyEditorValue()
//     }
//   }

//   CustomEditor.clearEditor(formulaEditor)
//   CustomEditor.clearEditor(cellEditor)

//   newState.activeCellInputData = {
//     ...newState.activeCellInputData,
//     formulaValue,
//     cellValue,
//   }

//   newState.activeCellPosition = { x: newX, y: newY }

//   if (shouldScroll)
//     scrollTo({
//       newState,
//       newY,
//       newX,
//     })

//   return newState
// }

// export const changeValue = ({ newState, row, column, newData }) => {
//   const { sheetCellData } = newState

//   // ! need to parse data and determine if it's a formula type
//   // ! Need to update all dependent cells

//   const { value: newValue } = newData

//   const currentCellData = getCellData(sheetCellData, row, column)

//   const newSheetCellData = { ...sheetCellData }

//   if (currentCellData) {
//     if (currentCellData !== newValue || currentCellData.type !== newData.type) {
//       newSheetCellData[row][column] = { ...currentCellData, ...newData }
//       newState.sheetCellData = newSheetCellData
//     }
//   } else if (!isObjectEmpty(newData)) {
//     // ! Change type
//     if (!newSheetCellData[row]) newSheetCellData[row] = {}
//     newSheetCellData[row][column] = newData
//     newState.sheetCellData = newSheetCellData
//   }

//   return newState
// }

// export const saveActiveCellInputData = ({ newState }) => {
//   const {
//     isEditMode,
//     activeCellInputData: { cellValue },
//     activeCellPosition,
//     sheetCellData,
//   } = newState

//   if (isEditMode) {
//     const { x, y } = activeCellPosition

//     let styles
//     if (sheetCellData[y] && sheetCellData[y][x])
//       styles = sheetCellData[y][x].styles

//     const children = cellValue[0].children

//     // ! TODO : Determine type from plaintext
//     const plaintext = convertEditorValueToText(cellValue)

//     // With a given type, even if the inputted value is rich-text, it will be converted to regular text
//     // For example: Formulas, prepopulate strings, etc...
//     // We need to always convert text to plain text to determine the type of string...
//     if (children.length > 1) {
//       newState = changeValue({
//         newState,
//         row: y,
//         column: x,
//         newData: {
//           value: convertEditorValueToRichText(cellValue),
//           type: 'rich-text',
//         },
//       })
//     } else {
//       newState = changeValue({
//         newState,
//         row: y,
//         column: x,
//         newData: {
//           value: convertEditorValueToText(cellValue),
//           type: 'normal',
//         },
//       })
//     }

//     newState.isEditMode = false
//   }

//   return newState
// }
