import { ICellRefMap, IVisited } from '../@types/objects'
import {
  IPosition,
  ISheetName,
  IDependentReferences,
  IIndependentReferences,
  IExcelState,
  IResults,
  ISheetsMap,
  ICell,
} from '../@types/state'
import { convertStringPositionToPosition } from './parser'
import { sheetNameAdressRegex } from './regex'
import { convertAddressRangeToRange } from './conversion'
import { TYPE_FORMULA, TYPE_NUMBER, TYPE_TEXT } from '../constants/types'
import { nSelectActiveCell } from '../redux/tools/selectors'
import FormulaParser from 'fast-formula-parser'
import { Queue } from './data_structures/queue'
import cloneDeep from 'clone-deep'

export const createFormulaParser = (sheetsMap: ISheetsMap): FormulaParser =>
  new FormulaParser({
    onCell: ({ sheet, row: rowIndex, col: columnIndex }) => {
      const sheetContent = sheetsMap[sheet].data

      const results = window.results

      if (sheetContent) {
        if (sheetContent[rowIndex] && sheetContent[rowIndex][columnIndex]) {
          const cell = sheetContent[rowIndex][columnIndex]
          let value: string | number | null = 0

          switch (cell.type) {
            case TYPE_FORMULA:
              if (results[sheet] && results[sheet][rowIndex] !== undefined)
                value = results[sheet][rowIndex][columnIndex]
              break
            case TYPE_NUMBER:
            case TYPE_TEXT:
              value = cell.value as string | number
              break
          }

          return value
        }
      }
    },
    onRange: ({ from, to, sheet }) => {
      const rangeData = []
      const sheetContent = sheetsMap[sheet].data

      const results = window.results

      if (sheetContent) {
        for (let rowIndex = from.row; rowIndex <= to.row; rowIndex++) {
          const row = sheetContent[rowIndex]
          const rowArray = []
          if (row) {
            for (
              let columnIndex = from.col;
              columnIndex <= to.col;
              columnIndex++
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

export const createCellRefMap = (
  formula: string,
  sheetName: ISheetName
): ICellRefMap => {
  const cellRefMap: ICellRefMap = {}

  const addresses = formula.match(sheetNameAdressRegex)
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
          adrSheetName.startsWith("'") && adrSheetName.endsWith("'")
            ? adrSheetName.substring(1, adrSheetName.length - 1)
            : adrSheetName
      }

      if (!cellRefMap[adrSheetName])
        cellRefMap[adrSheetName] = {
          positions: [],
          areaRanges: [],
        }

      if (adrRef.includes(':')) {
        cellRefMap[adrSheetName].areaRanges.push(
          convertAddressRangeToRange(adrRef)
        )
      } else {
        cellRefMap[adrSheetName].positions.push(
          convertStringPositionToPosition(adrRef)
        )
      }
    })
  }

  return cellRefMap
}

/**
 * For these functions, assume that the state value have already been updated...
 */

/**
 * Clear sheet results
 * Clear sheet dependents
 * Go through sheet independents and recompute the dependents values
 */
export const updateReferencesDeleteSheet = (
  sheetName: ISheetName,
  dependents: IDependentReferences,
  // independents: IIndependentReferences,
  results: IResults
): void => {
  delete results[sheetName]
  delete dependents[sheetName]

  // const sheetIndependents = independents[sheetName]
}

const assignSheetIndependents = (
  independents: IIndependentReferences,
  sheetName: ISheetName,
  dependentSheetName: ISheetName,
  position: IPosition,
  dependentPosition: IPosition
): void => {
  const { x, y } = position
  if (!independents[sheetName]) independents[sheetName] = {}
  if (!independents[sheetName][y]) independents[sheetName][y] = {}
  if (!independents[sheetName][y][x]) independents[sheetName][y][x] = {}
  if (!independents[sheetName][y][x][dependentSheetName])
    independents[sheetName][y][x][dependentSheetName] = {}
  if (!independents[sheetName][y][x][dependentSheetName][dependentPosition.y])
    independents[sheetName][y][x][dependentSheetName][dependentPosition.y] = {}
  if (
    !independents[sheetName][y][x][dependentSheetName][dependentPosition.y][
      dependentPosition.x
    ]
  )
    independents[sheetName][y][x][dependentSheetName][dependentPosition.y][
      dependentPosition.x
    ] = true
}

const assignResult = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition
) => {
  try {
    const results = window.results

    if (!results[sheetName]) results[sheetName] = {}
    if (!results[sheetName][position.y]) results[sheetName][position.y] = {}

    results[sheetName][position.y][position.x] = parser.parse(
      sheetsMap[sheetName].data[position.y][position.x].value,
      {
        sheet: sheetName,
        row: position.y,
        col: position.x,
      }
    )
  } catch (error) {
    console.error(
      `Error at [ sheet name: ${sheetName} | position:  ${JSON.stringify(
        position
      )} ] - ${error}`
    )
  }
}

const computeDependents = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition,
  independents: IIndependentReferences,
  visited: IVisited
) => {
  const queue = new Queue()

  if (
    independents[sheetName] &&
    independents[sheetName][position.y] &&
    independents[sheetName][position.y][position.x]
  ) {
    const sheetDependents = independents[sheetName][position.y][position.x]

    for (const sheetName in sheetDependents) {
      const sheetDependent = sheetDependents[sheetName]

      if (!visited[sheetName]) visited[sheetName] = {}

      for (const rowIndex in sheetDependent) {
        const rowDependents = sheetDependent[rowIndex]
        if (!visited[sheetName][rowIndex])
          visited[sheetName][rowIndex] = new Set()

        for (const columnIndex in rowDependents) {
          queue.enqueue({
            position: { x: +columnIndex, y: +rowIndex },
            sheetName,
          })
        }
      }
    }
  }

  while (!queue.isEmpty()) {
    const { sheetName, position } = queue.dequeue()

    if (
      !visited[sheetName] ||
      !visited[sheetName][position.y] ||
      !visited[sheetName][position.y].has(+position.x)
    ) {
      visited[sheetName][position.y].add(position.x)
      assignResult(parser, sheetsMap, sheetName, position)
    }

    if (
      independents[sheetName] &&
      independents[sheetName][position.y] &&
      independents[sheetName][position.y][position.x]
    ) {
      const sheetDependents = independents[sheetName][position.y][position.x]

      for (const sheetName in sheetDependents) {
        const sheetDependent = sheetDependents[sheetName]

        if (!visited[sheetName]) visited[sheetName] = {}

        for (const rowIndex in sheetDependent) {
          const rowDependents = sheetDependent[rowIndex]
          if (!visited[sheetName][rowIndex])
            visited[sheetName][rowIndex] = new Set()

          for (const columnIndex in rowDependents) {
            if (!visited[sheetName][rowIndex].has(+columnIndex)) {
              queue.enqueue({
                position: { x: +columnIndex, y: +rowIndex },
                sheetName,
              })
            }
          }
        }
      }
    }
  }
}

export const updateActiveCellRef = (state: IExcelState): void => {
  const focusedCell = nSelectActiveCell(state)
  const focusedCellPosition = state.activeCellPosition
  const focusedSheetName = state.activeSheetName

  updateReferenceCell(
    state,
    {},
    focusedCell,
    focusedCellPosition,
    focusedSheetName
  )
}

export const updateReferenceCell = (
  state: IExcelState,
  visited: IVisited,
  focusedCell: ICell,
  focusedCellPosition: IPosition,
  focusedSheetName: ISheetName
): void => {
  const dependents = state.dependentReferences
  const independents = state.independentReferences
  const results = state.results
  const sheetsMap = state.sheetsMap
  const parser: FormulaParser = createFormulaParser(sheetsMap)

  window.results = results

  // Result is to be recomputed because we changed the value
  if (
    results[focusedSheetName] &&
    results[focusedSheetName][focusedCellPosition.y] &&
    results[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]
  ) {
    delete results[focusedSheetName][focusedCellPosition.y][
      focusedCellPosition.x
    ]
  }

  // Dependents need to be removed
  if (
    dependents[focusedSheetName] &&
    dependents[focusedSheetName][focusedCellPosition.y] &&
    dependents[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]
  ) {
    delete dependents[focusedSheetName][focusedCellPosition.y][
      focusedCellPosition.x
    ]

    // const sheetIndependents =
    //   dependents[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]

    // ! This doesn't work.. how to remove independents properly?
    // for (const sheetName in sheetIndependents) {
    //   const { areaRanges, positions } = sheetIndependents[sheetName]

    //   if (positions) {
    //     for (const position of positions) {
    //       const { x, y } = position

    //       delete independents[sheetName][y][x]
    //     }
    //   }

    //   if (areaRanges) {
    //     for (const areaRange of areaRanges) {
    //       const { xRange, yRange } = areaRange

    //       for (
    //         let rowIndex = yRange.start;
    //         rowIndex <= yRange.end;
    //         rowIndex++
    //       ) {
    //         for (
    //           let columnIndex = xRange.start;
    //           columnIndex <= xRange.end;
    //           columnIndex++
    //         ) {
    //           delete independents[sheetName][rowIndex][columnIndex]
    //         }
    //       }
    //     }
    //   }
    // }
  }

  // Dependents and independents need to be created due to formula
  switch (focusedCell.type) {
    case TYPE_FORMULA: {
      // TODO
      // ! Check for cyclic dependencies
      const formulaReferences = createCellRefMap(
        focusedCell.value as string,
        focusedSheetName
      )
      const { x, y } = focusedCellPosition
      if (!dependents[focusedSheetName]) dependents[focusedSheetName] = {}
      if (!dependents[focusedSheetName][y]) dependents[focusedSheetName][y] = {}
      if (!dependents[focusedSheetName][y][x])
        dependents[focusedSheetName][y][x] = {}

      const formulaIndependents = dependents[focusedSheetName][y][x]

      // create new dependents
      for (const sheetName in formulaReferences) {
        const sheetFormulaDependents = formulaReferences[sheetName]
        const { areaRanges, positions } = sheetFormulaDependents

        if (!formulaIndependents[sheetName]) formulaIndependents[sheetName] = {}

        if (areaRanges) formulaIndependents[sheetName].areaRanges = areaRanges
        if (positions) formulaIndependents[sheetName].positions = positions

        if (!independents[sheetName]) independents[sheetName] = {}

        for (const position of positions) {
          assignSheetIndependents(
            independents,
            sheetName,
            focusedSheetName,
            position,
            focusedCellPosition
          )
        }

        for (const areaRange of areaRanges) {
          const { xRange, yRange } = areaRange

          for (
            let rowIndex = yRange.start;
            rowIndex <= yRange.end;
            rowIndex++
          ) {
            for (
              let columnIndex = xRange.start;
              columnIndex <= xRange.end;
              columnIndex++
            ) {
              assignSheetIndependents(
                independents,
                sheetName,
                focusedSheetName,
                { x: columnIndex, y: rowIndex },
                focusedCellPosition
              )
            }
          }
        }
      }

      // ! Recompute value
      assignResult(parser, sheetsMap, focusedSheetName, focusedCellPosition)

      visited[focusedSheetName] = {
        [focusedCellPosition.y]: new Set(),
      }

      visited[focusedSheetName][focusedCellPosition.y].add(
        focusedCellPosition.x
      )

      break
    }
  }

  // Look at dependents of this cell and recompute...
  computeDependents(
    parser,
    state.sheetsMap,
    focusedSheetName,
    focusedCellPosition,
    independents,
    visited
  )

  delete window.results
}

export const visitFormulaCell = (
  parser: FormulaParser,
  state: IExcelState,
  visited: IVisited,
  sheetName: ISheetName,
  curPosition: IPosition,
  formula: string
): void => {
  const sheetsMap = state.sheetsMap
  const independents = state.independentReferences
  const dependents = state.dependentReferences

  const cellRefMap = createCellRefMap(formula, sheetName)

  if (!visited[sheetName]) visited[sheetName] = {}

  const visitedSheet = visited[sheetName]

  if (!visitedSheet[curPosition.y]) visitedSheet[curPosition.y] = new Set()
  if (!visitedSheet[curPosition.y].has(+curPosition.x))
    visitedSheet[curPosition.y].add(+curPosition.x)

  if (!dependents[sheetName]) dependents[sheetName] = {}
  if (!dependents[sheetName][curPosition.y])
    dependents[sheetName][curPosition.y] = {}
  if (!dependents[sheetName][curPosition.y][curPosition.x])
    dependents[sheetName][curPosition.y][curPosition.x] = {}

  const formulaIndependents =
    dependents[sheetName][curPosition.y][curPosition.x]

  for (const refSheetName in cellRefMap) {
    if (sheetsMap[refSheetName]) {
      if (!visited[refSheetName]) visited[refSheetName] = {}

      const { areaRanges, positions } = cellRefMap[refSheetName]
      const visitedSheet = visited[refSheetName]

      if (!formulaIndependents[refSheetName])
        formulaIndependents[refSheetName] = {}

      if (areaRanges) formulaIndependents[refSheetName].areaRanges = areaRanges
      if (positions) formulaIndependents[refSheetName].positions = positions

      const refSheet = sheetsMap[refSheetName].data

      for (const position of positions) {
        const { x, y } = position

        if (!visitedSheet[y]) visitedSheet[y] = new Set()
        if (!visitedSheet[y].has(x)) {
          visitedSheet[y].add(x)

          if (refSheet[y] && refSheet[y][x]) {
            const cell = refSheet[y][x]

            if (cell.type === TYPE_FORMULA) {
              visitFormulaCell(
                parser,
                state,
                visited,
                refSheetName,
                position,
                cell.value as string
              )
            }
          }
        }

        assignSheetIndependents(
          independents,
          refSheetName,
          sheetName,
          position,
          curPosition
        )
      }

      for (const areaRange of areaRanges) {
        const { xRange, yRange } = areaRange

        for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex++) {
          const row = refSheet[rowIndex]
          if (!visitedSheet[rowIndex]) visitedSheet[rowIndex] = new Set()

          for (
            let columnIndex = xRange.start;
            columnIndex <= xRange.end;
            columnIndex++
          ) {
            const position = { x: +columnIndex, y: +rowIndex }

            if (!visitedSheet[rowIndex].has(columnIndex)) {
              visitedSheet[rowIndex].add(columnIndex)

              if (refSheet[rowIndex] && refSheet[rowIndex][columnIndex]) {
                const cell = row[columnIndex]
                if (cell.type === TYPE_FORMULA) {
                  visitFormulaCell(
                    parser,
                    state,
                    visited,
                    refSheetName,
                    position,
                    cell.value as string
                  )
                }
              }
            }

            assignSheetIndependents(
              independents,
              refSheetName,
              sheetName,
              position,
              curPosition
            )
          }
        }
      }
    }
  }

  assignResult(parser, sheetsMap, sheetName, curPosition)
}

/**
 * Visits cells from top down
 */
export const updateWorkbookReference = (state: IExcelState): IExcelState => {
  const visited: IVisited = {}

  const sheetsMap = state.sheetsMap

  const parser: FormulaParser = createFormulaParser(sheetsMap)

  window.results = state.results

  for (const sheetName in sheetsMap) {
    const sheet = sheetsMap[sheetName].data

    if (!visited[sheetName]) visited[sheetName] = {}

    for (const rowIndex in sheet) {
      const row = sheet[rowIndex]

      if (!visited[sheetName][rowIndex])
        visited[sheetName][rowIndex] = new Set()

      for (const columnIndex in row) {
        const cell = row[columnIndex]

        if (!visited[sheetName][rowIndex].has(+columnIndex)) {
          visited[sheetName][rowIndex].add(+columnIndex)

          if (cell.type === TYPE_FORMULA) {
            visitFormulaCell(
              parser,
              state,
              visited,
              sheetName,
              { x: +columnIndex, y: +rowIndex },
              cell.value as string
            )
          }
        }
      }
    }
  }

  // Update references
  state.independentReferences = cloneDeep(state.independentReferences)
  state.dependentReferences = cloneDeep(state.dependentReferences)
  state.results = cloneDeep(state.results)

  delete window.results

  return state
}
