import FormulaParser from 'fast-formula-parser'
import { ISheetsMap, ISheetName, IPosition } from '../../@types/state'
import { TYPE_FORMULA, TYPE_NUMBER, TYPE_TEXT } from '../../constants/types'

export const createFormulaParser = (sheetsMap: ISheetsMap): FormulaParser =>
  new FormulaParser({
    onCell: ({ sheet, row: rowIndex, col: columnIndex }) => {
      let value: string | number | null = null

      if (sheetsMap[sheet] && sheetsMap[sheet].data) {
        const { results } = window
        const sheetContent = sheetsMap[sheet].data

        if (sheetContent[rowIndex] && sheetContent[rowIndex][columnIndex]) {
          const cell = sheetContent[rowIndex][columnIndex]

          switch (cell.type) {
            case TYPE_FORMULA:
              if (results[sheet] && results[sheet][rowIndex] !== undefined)
                value = results[sheet][rowIndex][columnIndex]
              break
            case TYPE_NUMBER:
            case TYPE_TEXT:
              value = cell.value as string | number
              break
            default:
              break
          }
        }
      }

      return value
    },
    onRange: ({ from, to, sheet }) => {
      const rangeData = []

      if (sheetsMap[sheet] && sheetsMap[sheet].data) {
        const { results } = window
        const sheetContent = sheetsMap[sheet].data

        for (let rowIndex = from.row; rowIndex <= to.row; rowIndex += 1) {
          const row = sheetContent[rowIndex]
          const rowArray = []
          if (row) {
            for (
              let columnIndex = from.col;
              columnIndex <= to.col;
              columnIndex += 1
            ) {
              const cell = row[columnIndex]
              let value: string | number | null = null

              if (cell) {
                switch (cell.type) {
                  case TYPE_FORMULA:
                    if (
                      results[sheet] &&
                      results[sheet][rowIndex] !== undefined
                    )
                      value = results[sheet][rowIndex][columnIndex]
                    break
                  case TYPE_NUMBER:
                  case TYPE_TEXT:
                    value = cell.value as string | number
                    break
                  default:
                    break
                }
              }

              rowArray.push(value)
            }
          }

          rangeData.push(rowArray)
        }
      }

      return rangeData
    },
  })

export const computeResult = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition
) => {
  try {
    const cell = sheetsMap[sheetName].data[position.y][position.x]

    if (cell.type === TYPE_FORMULA) {
      const { results } = window

      if (!results[sheetName]) results[sheetName] = {}
      if (!results[sheetName][position.y]) results[sheetName][position.y] = {}

      results[sheetName][position.y][position.x] = parser.parse(cell.value, {
        sheet: sheetName,
        row: position.y,
        col: position.x,
      })
    }
  } catch (error) {
    console.error(
      `Error at [ sheet name: ${sheetName} | position:  ${JSON.stringify(
        position
      )} ] - ${error}`
    )
  }
}
