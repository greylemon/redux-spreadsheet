import FormulaParser from 'fast-formula-parser'
import {
  ISheetName,
  ISheetsMap,
  IDependentReferences,
  IIndependentReferences,
  IResults,
  IPosition,
  IExcelState,
  ICell,
} from '../../@types/state'
import { clearIndependents } from './clear'
import { createSheetAddressReferences } from './addressReference'
import { IAddressReference, IVisited, ICellRefMap } from '../../@types/objects'
import { Queue } from '../data_structures/queue'
import { createFormulaParser } from './parser'
import { TYPE_FORMULA } from '../../constants/types'
import { sheetNameAdressRegex } from '../regex'
import {
  convertAddressRangeToRange,
  convertStringPositionToPosition,
} from '../conversion'

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
        const [refSheetName, ref] = address.split('!')
        adrRef = ref
        adrSheetName =
          refSheetName.startsWith("'") && refSheetName.endsWith("'")
            ? refSheetName.substring(1, refSheetName.length - 1)
            : refSheetName
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

const computeResult = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition
) => {
  try {
    const { results } = window

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

const computeFormulas = (
  sheetsMap: ISheetsMap,
  independents: IIndependentReferences,
  results: IResults,
  addressReferences: IAddressReference[]
) => {
  window.results = results
  const visited: IVisited = {}
  const queue = new Queue()
  const parser = createFormulaParser(sheetsMap)

  addressReferences.forEach((addressReference) =>
    queue.enqueue(addressReference)
  )

  while (!queue.isEmpty()) {
    const {
      sheetName: poppedSheetName,
      position: poppedPosition,
    } = queue.dequeue()

    if (
      !visited[poppedSheetName] ||
      !visited[poppedSheetName][poppedPosition.y] ||
      !visited[poppedSheetName][poppedPosition.y].has(+poppedPosition.x)
    ) {
      if (!visited[poppedSheetName]) visited[poppedSheetName] = {}
      if (!visited[poppedSheetName][poppedPosition.y])
        visited[poppedSheetName][poppedPosition.y] = new Set()

      visited[poppedSheetName][poppedPosition.y].add(poppedPosition.x)
      computeResult(parser, sheetsMap, poppedSheetName, poppedPosition)
    }

    if (
      independents[poppedSheetName] &&
      independents[poppedSheetName][poppedPosition.y] &&
      independents[poppedSheetName][poppedPosition.y][poppedPosition.x]
    ) {
      const sheetDependents =
        independents[poppedSheetName][poppedPosition.y][poppedPosition.x]

      Object.keys(sheetDependents).forEach((dependentSheetName) => {
        const sheetDependent = sheetDependents[dependentSheetName]

        if (!visited[dependentSheetName]) visited[dependentSheetName] = {}

        Object.keys(sheetDependent).forEach((rowIndex) => {
          const rowDependents = sheetDependent[rowIndex]
          if (!visited[dependentSheetName][rowIndex])
            visited[dependentSheetName][rowIndex] = new Set()

          Object.keys(rowDependents).forEach((columnIndex) => {
            if (!visited[dependentSheetName][rowIndex].has(+columnIndex)) {
              queue.enqueue({
                position: { x: +columnIndex, y: +rowIndex },
                sheetName: dependentSheetName,
              })
            }
          })
        })
      })
    }
  }

  delete window.results
}

const assignDependentsAndIndependents = (
  independents: IIndependentReferences,
  dependents: IDependentReferences,
  position: IPosition,
  cell: ICell,
  sheetName: ISheetName
) => {
  const { x, y } = position
  // TODO
  // ! Check for cyclic dependencies
  const formulaReferences = createCellRefMap(cell.value as string, sheetName)

  if (!dependents[sheetName]) dependents[sheetName] = {}
  if (!dependents[sheetName][y]) dependents[sheetName][y] = {}
  if (!dependents[sheetName][y][x]) dependents[sheetName][y][x] = {}

  const formulaIndependents = dependents[sheetName][y][x]

  // create new dependents
  Object.keys(formulaReferences).forEach((refSheetName) => {
    const sheetFormulaDependents = formulaReferences[refSheetName]
    const { areaRanges, positions: refPositions } = sheetFormulaDependents

    if (!formulaIndependents[refSheetName])
      formulaIndependents[refSheetName] = {}

    if (areaRanges) formulaIndependents[refSheetName].areaRanges = areaRanges
    if (refPositions) formulaIndependents[refSheetName].positions = refPositions

    refPositions.forEach((refPosition) => {
      assignSheetIndependents(
        independents,
        refSheetName,
        sheetName,
        refPosition,
        position
      )
    })

    areaRanges.forEach((areaRange) => {
      const { xRange, yRange } = areaRange

      for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
        for (
          let columnIndex = xRange.start;
          columnIndex <= xRange.end;
          columnIndex += 1
        ) {
          assignSheetIndependents(
            independents,
            refSheetName,
            sheetName,
            { x: columnIndex, y: rowIndex },
            position
          )
        }
      }
    })
  })
}

// TODO : Update independents
export const updateActiveCellRef = (
  sheetName: ISheetName,
  position: IPosition,
  sheetsMap: ISheetsMap,
  dependents: IDependentReferences,
  independents: IIndependentReferences,
  results: IResults
) => {
  const addressReferences: IAddressReference[] = []
  const { x, y } = position
  const cell =
    sheetsMap[sheetName].data[y] && sheetsMap[sheetName].data[y][x]
      ? sheetsMap[sheetName].data[y][x]
      : undefined

  if (cell && cell.type === TYPE_FORMULA) {
    addressReferences.push({ position, sheetName })
    assignDependentsAndIndependents(
      independents,
      dependents,
      position,
      cell,
      sheetName
    )
  }

  if (
    results[sheetName] &&
    results[sheetName][position.y] &&
    results[sheetName][position.y][position.x]
  )
    delete results[sheetName][position.y][position.x]

  if (
    independents[sheetName] &&
    independents[sheetName][position.y] &&
    independents[sheetName][position.y][position.x]
  )
    Object.keys(independents[sheetName][position.y][position.x]).forEach(
      (dependentSheetName) => {
        const dependentSheet =
          independents[sheetName][position.y][position.x][dependentSheetName]

        if (dependentSheet)
          Object.keys(dependentSheet).forEach((rowIndex) => {
            const row = dependentSheet[rowIndex]

            if (row)
              Object.keys(row).forEach((columnIndex) => {
                addressReferences.push({
                  sheetName: dependentSheetName,
                  position: { y: +rowIndex, x: +columnIndex },
                })
              })
          })
      }
    )

  computeFormulas(sheetsMap, independents, results, addressReferences)
}

export const deleteSheetRef = (
  sheetName: ISheetName,
  sheetsMap: ISheetsMap,
  dependents: IDependentReferences,
  independents: IIndependentReferences,
  results: IResults
) => {
  // Delete dependency on independent
  clearIndependents(independents, { [sheetName]: dependents[sheetName] })
  delete dependents[sheetName]
  delete results[sheetName]

  const addressReferences = createSheetAddressReferences(
    independents,
    sheetName
  )

  computeFormulas(sheetsMap, independents, results, addressReferences)
}

export const updateWorkbookReference = (state: IExcelState): IExcelState => {
  const addressReferences: IAddressReference[] = []
  Object.keys(state.sheetsMap).forEach((sheetName) => {
    const sheet = state.sheetsMap[sheetName].data

    Object.keys(sheet).forEach((rowIndex) => {
      const row = sheet[+rowIndex]

      Object.keys(row).forEach((columnIndex) => {
        const cell = row[+columnIndex]

        if (cell.type === TYPE_FORMULA) {
          const position: IPosition = { x: +columnIndex, y: +rowIndex }
          assignDependentsAndIndependents(
            state.independentReferences,
            state.dependentReferences,
            position,
            cell,
            sheetName
          )
          addressReferences.push({ sheetName, position })
        }
      })
    })
  })

  computeFormulas(
    state.sheetsMap,
    state.independentReferences,
    state.results,
    addressReferences
  )

  return state
}
