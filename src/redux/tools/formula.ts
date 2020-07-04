import { IFormulaMap } from '../../@types/objects'
import { IPosition, ISheetName, IRows } from '../../@types/state'
import { convertStringPositionToPosition } from '../../tools/parser'
import { sheetNameRegex } from '../../tools/regex'
import { convertAddressRangeToRange } from '../../tools/conversion'
import { TYPE_FORMULA } from '../../constants/cellTypes'

export const visitFormulaCell = (
  formulaMap: IFormulaMap,
  sheetsData: {
    [key: string]: IRows
  },
  visited: {
    // sheet name
    [key: string]: {
      // row
      [key: string]: {
        // column
        [key: string]: boolean
      }
    }
  },
  parser: any,
  sheetName: ISheetName,
  curPosition: IPosition,
  formula: string
): void => {
  const cellRefMap: {
    // sheet name
    [key: string]: IPosition[]
  } = {}

  const addresses = formula.match(sheetNameRegex)
  if (!visited[sheetName]) visited[sheetName] = {}

  const visitedSheet = visited[sheetName]

  if (!visitedSheet[curPosition.y]) visitedSheet[curPosition.y] = {}
  if (!visitedSheet[curPosition.y][curPosition.x])
    visitedSheet[curPosition.y][curPosition.x] = true

  // Get the references in the formula
  if (addresses) {
    addresses.forEach((address) => {
      let adrSheetName = sheetName
      let adrRef = address
      if (address.includes('!')) {
        const sheetAddress = address.split('!')
        adrRef = sheetAddress[1]
        adrSheetName = sheetAddress[0]
        adrSheetName =
          adrSheetName.startsWith('') && adrSheetName.endsWith('')
            ? adrSheetName.substring(1, adrSheetName.length - 1)
            : adrSheetName
      }

      if (!cellRefMap[adrSheetName]) cellRefMap[adrSheetName] = []

      if (adrRef.includes(':')) {
        const positions: IPosition[] = []
        const areaRange = convertAddressRangeToRange(adrRef)

        const { xRange, yRange } = areaRange

        const { start: startX, end: endX } = xRange
        const { start: startY, end: endY } = yRange

        for (let r = startY; r <= endY; r++) {
          for (let c = startX; c <= endX; c++) positions.push({ x: c, y: r })
        }

        cellRefMap[adrSheetName].concat(positions)
      } else {
        cellRefMap[adrSheetName].push(convertStringPositionToPosition(adrRef))
      }
    })
  }

  for (const refSheetName in cellRefMap) {
    if (!visited[refSheetName]) visited[refSheetName] = {}

    const positions = cellRefMap[refSheetName]
    const visitedSheet = visited[refSheetName]

    for (const position of positions) {
      const { x, y } = position

      if (!visitedSheet[y]) visitedSheet[y] = {}
      if (!visitedSheet[y][x]) {
        visitedSheet[y][x] = true

        const refSheet = sheetsData[refSheetName]

        if (refSheet) {
          for (const rowIndex in refSheet) {
            const row = refSheet[rowIndex]
            for (const columnIndex in row) {
              const cell = row[columnIndex]

              if (cell.type === TYPE_FORMULA) {
                visitFormulaCell(
                  formulaMap,
                  sheetsData,
                  visited,
                  parser,
                  refSheetName,
                  { x: +columnIndex, y: +rowIndex },
                  cell.value as string
                )
              }
            }
          }
        }
      }
    }
  }

  if (!formulaMap[sheetName]) formulaMap[sheetName] = {}
  if (!formulaMap[sheetName][curPosition.y])
    formulaMap[sheetName][curPosition.y] = {}

  try {
    formulaMap[sheetName][curPosition.y][curPosition.x] = parser.parse(
      formula,
      {
        sheet: sheetName,
        row: curPosition.y,
        col: curPosition.x,
      }
    )
  } catch (error) {
    // console.error({ sheetName: sheetName, position: curPosition, error })
    console.error(
      `Error at [ sheet name: ${sheetName} | position:  ${JSON.stringify(
        curPosition
      )} ] - ${error}`
    )
  }
}
