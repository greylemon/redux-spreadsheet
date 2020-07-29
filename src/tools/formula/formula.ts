import uniqid from 'uniqid'
import {
  ISheetName,
  ISheetsMap,
  IDependentReferences,
  IIndependentReferences,
  IResults,
  IPosition,
  IExcelState,
  ICell,
  IIndependentDependentReferenceMap,
  IDependentIndependentReferenceMap,
  ISheetToIndependentDependentMap,
} from '../../@types/state'
import { createSheetAddressReferences } from './addressReference'
import { IAddressReference, IVisited, ICellRefMap } from '../../@types/objects'
import { Queue } from '../data_structures/queue'
import { createFormulaParser, computeResult } from './parser'
import { TYPE_FORMULA } from '../../constants/types'
import { sheetNameAdressRegex } from '../regex'
import {
  convertAddressRangeToRange,
  convertStringPositionToPosition,
} from '../conversion'

const assignSheetIndependents = (
  independents: IIndependentReferences,
  independentDependents: IIndependentDependentReferenceMap,
  sheetToIndependentDependentMap: ISheetToIndependentDependentMap,
  sheetName: ISheetName,
  dependentSheetName: ISheetName,
  position: IPosition,
  dependentPosition: IPosition
): void => {
  const { x, y } = position
  if (!independents[sheetName]) independents[sheetName] = {}
  if (!independents[sheetName][y]) independents[sheetName][y] = {}

  if (!independents[sheetName][y][x]) independents[sheetName][y][x] = uniqid()

  const independentDependentId = independents[sheetName][y][x]

  if (!independentDependents[independentDependentId])
    independentDependents[independentDependentId] = {}

  if (!independentDependents[independentDependentId][dependentSheetName]) {
    independentDependents[independentDependentId][dependentSheetName] = {}
  }
  if (
    !independentDependents[independentDependentId][dependentSheetName][
      dependentPosition.y
    ]
  )
    independentDependents[independentDependentId][dependentSheetName][
      dependentPosition.y
    ] = {}
  if (
    !independentDependents[independentDependentId][dependentSheetName][
      dependentPosition.y
    ][dependentPosition.x]
  )
    independentDependents[independentDependentId][dependentSheetName][
      dependentPosition.y
    ][dependentPosition.x] = true

  // Assign sheet to id reference map
  if (!sheetToIndependentDependentMap[dependentSheetName])
    sheetToIndependentDependentMap[dependentSheetName] = {}
  sheetToIndependentDependentMap[dependentSheetName][
    independents[sheetName][y][x]
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

const computeFormulas = (
  sheetsMap: ISheetsMap,
  independents: IIndependentReferences,
  independentDependent: IIndependentDependentReferenceMap,
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
      const sheetDependentsId =
        independents[poppedSheetName][poppedPosition.y][poppedPosition.x]

      const sheetDependents = independentDependent[sheetDependentsId]

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
  independentDependents: IIndependentDependentReferenceMap,
  sheetToIndependentDependentMap: ISheetToIndependentDependentMap,
  dependents: IDependentReferences,
  dependentsIndependents: IDependentIndependentReferenceMap,
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
  if (!dependents[sheetName][y][x]) dependents[sheetName][y][x] = uniqid()

  const formulaIndependentsId = dependents[sheetName][y][x]

  if (!dependentsIndependents[formulaIndependentsId])
    dependentsIndependents[formulaIndependentsId] = {}

  // create new dependents
  Object.keys(formulaReferences).forEach((refSheetName) => {
    const sheetFormulaDependents = formulaReferences[refSheetName]
    const { areaRanges, positions: refPositions } = sheetFormulaDependents

    if (!dependentsIndependents[formulaIndependentsId][refSheetName])
      dependentsIndependents[formulaIndependentsId][refSheetName] = {}

    if (areaRanges)
      dependentsIndependents[formulaIndependentsId][
        refSheetName
      ].areaRanges = areaRanges
    if (refPositions)
      dependentsIndependents[formulaIndependentsId][
        refSheetName
      ].positions = refPositions

    refPositions.forEach((refPosition) => {
      assignSheetIndependents(
        independents,
        independentDependents,
        sheetToIndependentDependentMap,
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
            independentDependents,
            sheetToIndependentDependentMap,
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
  dependentIndependent: IDependentIndependentReferenceMap,
  independents: IIndependentReferences,
  independentDependent: IIndependentDependentReferenceMap,
  sheetToIndependentDependentMap: ISheetToIndependentDependentMap,
  results: IResults
) => {
  const addressReferences: IAddressReference[] = []
  const { x, y } = position
  const cell =
    sheetsMap[sheetName].data[y] && sheetsMap[sheetName].data[y][x]
      ? sheetsMap[sheetName].data[y][x]
      : undefined

  // Delete dependency on independent
  if (
    dependents[sheetName] &&
    dependents[sheetName][y] &&
    dependents[sheetName][y][x]
  ) {
    const dependentIndependentId = dependents[sheetName][y][x]

    const positionDependents = dependentIndependent[dependentIndependentId]

    if (positionDependents)
      Object.keys(positionDependents).forEach((independentSheetName) => {
        const rows = independentDependent[independentSheetName]

        Object.keys(rows).forEach((rowIndex) => {
          const columns = rows[rowIndex]

          Object.keys(columns).forEach((columnIndex) => {
            delete independentDependent[
              independents[independentSheetName][rowIndex][columnIndex]
            ][sheetName][y][x]
          })
        })
      })
  }

  if (cell && cell.type === TYPE_FORMULA) {
    addressReferences.push({ position, sheetName })
    assignDependentsAndIndependents(
      independents,
      independentDependent,
      sheetToIndependentDependentMap,
      dependents,
      dependentIndependent,
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
  ) {
    const independentDependentId =
      independents[sheetName][position.y][position.x]

    if (independentDependent[independentDependentId]) {
      Object.keys(independentDependent[independentDependentId]).forEach(
        (dependentSheetName) => {
          const dependentSheet =
            independentDependent[independentDependentId][dependentSheetName]

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
    }
  }

  computeFormulas(
    sheetsMap,
    independents,
    independentDependent,
    results,
    addressReferences
  )
}

export const deleteSheetRef = (
  sheetName: ISheetName,
  sheetsMap: ISheetsMap,
  dependents: IDependentReferences,
  independents: IIndependentReferences,
  independentDependent: IIndependentDependentReferenceMap,
  sheetToIndependentDependentMap: ISheetToIndependentDependentMap,
  results: IResults
) => {
  // Delete dependency on independent
  const sheetDependents = sheetToIndependentDependentMap[sheetName]

  if (sheetDependents) {
    Object.keys(sheetDependents).forEach((id) => {
      delete independentDependent[id][sheetName]
    })
  }

  delete dependents[sheetName]
  delete results[sheetName]

  const addressReferences = createSheetAddressReferences(
    independents,
    independentDependent,
    sheetName
  )

  computeFormulas(
    sheetsMap,
    independents,
    independentDependent,
    results,
    addressReferences
  )
}

export const deletePositions = (
  sheetName: ISheetName,
  positions: IPosition[],
  sheetsMap: ISheetsMap,
  dependents: IDependentReferences,
  dependentIndependent: IDependentIndependentReferenceMap,
  independents: IIndependentReferences,
  independentDependent: IIndependentDependentReferenceMap,
  sheetToIndependentDependentMap: ISheetToIndependentDependentMap,
  results: IResults
) => {
  const sheetIndependents = independents[sheetName]
  const addressReferences: IAddressReference[] = []

  // Remove independent dependents first
  positions.forEach((position) => {
    const { x, y } = position

    if (
      dependents[sheetName] &&
      dependents[sheetName][y] &&
      dependents[sheetName][y][x]
    ) {
      const dependentIndependentId = dependents[sheetName][y][x]

      const positionDependents = dependentIndependent[dependentIndependentId]

      if (positionDependents)
        Object.keys(positionDependents).forEach((independentSheetName) => {
          const rows = independentDependent[independentSheetName]

          Object.keys(rows).forEach((rowIndex) => {
            const columns = rows[rowIndex]

            Object.keys(columns).forEach((columnIndex) => {
              delete independentDependent[
                independents[independentSheetName][rowIndex][columnIndex]
              ][sheetName][y][x]
            })
          })
        })
    }

    if (results[sheetName] && results[sheetName][y] && results[sheetName][y][x])
      delete results[sheetName][y][x]
    if (
      dependents[sheetName] &&
      dependents[sheetName][y] &&
      dependents[sheetName][y][x]
    ) {
      delete dependents[sheetName][y][x]
    }
  })

  positions.forEach((position) => {
    const { x, y } = position
    const cell =
      sheetsMap[sheetName].data[y] && sheetsMap[sheetName].data[y][x]
        ? sheetsMap[sheetName].data[y][x]
        : undefined

    if (sheetIndependents && sheetIndependents[y] && sheetIndependents[y][x]) {
      const independentDependentId = sheetIndependents[y][x]

      if (independentDependent[independentDependentId]) {
        Object.keys(independentDependent[independentDependentId]).forEach(
          (dependentSheetName) => {
            const dependentSheet =
              independentDependent[independentDependentId][dependentSheetName]

            if (dependentSheet)
              Object.keys(dependentSheet).forEach((rowIndex) => {
                const row = dependentSheet[rowIndex]

                if (row) {
                  Object.keys(row).forEach((columnIndex) => {
                    addressReferences.push({
                      sheetName: dependentSheetName,
                      position: { y: +rowIndex, x: +columnIndex },
                    })
                  })
                }
              })
          }
        )
      }
    }

    if (cell && cell.type === TYPE_FORMULA) {
      addressReferences.push({ position, sheetName })
      assignDependentsAndIndependents(
        independents,
        independentDependent,
        sheetToIndependentDependentMap,
        dependents,
        dependentIndependent,
        position,
        cell,
        sheetName
      )
    }
  })

  computeFormulas(
    sheetsMap,
    independents,
    independentDependent,
    results,
    addressReferences
  )
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
            state.independentDependentReferences,
            state.sheetToIndependentDependentMap,
            state.dependentReferences,
            state.dependentIndependentReferences,
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
    state.independentDependentReferences,
    state.results,
    addressReferences
  )

  return state
}
