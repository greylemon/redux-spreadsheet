import {
  ISheetName,
  IDependentReferences,
  IIndependentReferences,
  IDependentIndependentReference,
  IAreaRange,
  IPosition,
  IColumnDependentReference,
  IRowDependentReference,
  IRowIndex,
  IColumnIndex,
} from '../../@types/state'

const clearIndependentsDependentAreaRanges = (
  sheetIndependents: IDependentIndependentReference,
  sheetName: ISheetName,
  areaRanges: IAreaRange[]
): void => {
  areaRanges.forEach(({ xRange, yRange }) => {
    for (let y = yRange.start; y <= yRange.end; y += 1) {
      for (let x = xRange.start; x <= xRange.end; x += 1) {
        if (sheetIndependents[y] && sheetIndependents[y][x])
          delete sheetIndependents[y][x][sheetName]
      }
    }
  })
}

const clearIndependentsDependentPositions = (
  sheetIndependents: IDependentIndependentReference,
  sheetName: ISheetName,
  positions: IPosition[]
): void => {
  if (sheetIndependents)
    positions.forEach(({ x, y }) => {
      if (sheetIndependents[y] && sheetIndependents[y][x])
        delete sheetIndependents[y][x][sheetName]
    })
}

const clearSheetDependentIndependents = (
  independents: IIndependentReferences,
  row: IColumnDependentReference,
  sheetName: ISheetName,
  columnIndex: IColumnIndex
): void => {
  const sheetDependentIndependents = row[columnIndex]

  if (sheetDependentIndependents)
    Object.keys(sheetDependentIndependents).forEach((independentSheetName) => {
      const { areaRanges, positions } = sheetDependentIndependents[
        independentSheetName
      ]
      const sheetIndependents = independents[independentSheetName]

      clearIndependentsDependentAreaRanges(
        sheetIndependents,
        sheetName,
        areaRanges
      )

      clearIndependentsDependentPositions(
        sheetIndependents,
        sheetName,
        positions
      )
    })
}

const clearSheetDependentsRow = (
  independents: IIndependentReferences,
  sheetDependents: IRowDependentReference,
  sheetName: ISheetName,
  rowIndex: IRowIndex
): void => {
  const row = sheetDependents[rowIndex]
  if (row)
    Object.keys(row).forEach((columnIndex) => {
      clearSheetDependentIndependents(
        independents,
        row,
        sheetName,
        +columnIndex
      )
    })
}

const clearSheetDependents = (
  independents: IIndependentReferences,
  affectedDependents: IDependentReferences,
  sheetName: ISheetName
): void => {
  const sheetDependents = affectedDependents[sheetName]

  if (sheetDependents)
    Object.keys(sheetDependents).forEach((rowIndex) => {
      clearSheetDependentsRow(
        independents,
        sheetDependents,
        sheetName,
        +rowIndex
      )
    })
}

export const clearIndependents = (
  independents: IIndependentReferences,
  affectedDependents: IDependentReferences
) => {
  Object.keys(affectedDependents).forEach((sheetName) => {
    clearSheetDependents(independents, affectedDependents, sheetName)
  })
}
