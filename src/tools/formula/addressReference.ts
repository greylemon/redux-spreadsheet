import {
  IRowIndependentReference,
  IColumnIndependentReference,
  IIndependentDependentReference,
  IIndependentDependentRowReference,
  ISheetName,
  IRowIndex,
  IColumnIndex,
  IIndependentReferences,
  IIndependentDependentReferenceMap,
} from '../../@types/state'
import { IAddressReference } from '../../@types/objects'

export const createDependentColumnAddressReferences = (
  sheet: IIndependentDependentRowReference,
  dependentSheetName: ISheetName,
  rowIndex: IRowIndex
): IAddressReference[] => {
  const addressReferences: IAddressReference[] = []

  const column = sheet[rowIndex]

  if (column)
    Object.keys(column).forEach((columnIndex) => {
      addressReferences.push({
        position: { x: +columnIndex, y: +rowIndex },
        sheetName: dependentSheetName,
      })
    })

  return addressReferences
}

export const createDependentRowAddressReferences = (
  dependentSheets: IIndependentDependentReference,
  dependentSheetName: ISheetName
): IAddressReference[] => {
  const sheet = dependentSheets[dependentSheetName]
  let addressReferences: IAddressReference[] = []

  if (sheet)
    Object.keys(sheet).forEach((rowIndex) => {
      addressReferences = addressReferences.concat(
        createDependentColumnAddressReferences(
          sheet,
          dependentSheetName,
          +rowIndex
        )
      )
    })

  return addressReferences
}

export const createDependentAddressReferences = (
  row: IColumnIndependentReference,
  independentDependents: IIndependentDependentReferenceMap,
  columnIndex: IColumnIndex
): IAddressReference[] => {
  let addressReferences: IAddressReference[] = []
  const dependentSheetId = row[columnIndex]
  const dependentSheets = independentDependents[dependentSheetId]

  if (dependentSheets)
    Object.keys(dependentSheets).forEach((dependentSheetName) => {
      addressReferences = addressReferences.concat(
        createDependentRowAddressReferences(dependentSheets, dependentSheetName)
      )
    })

  return addressReferences
}

export const createIndependentRowAddressReferences = (
  sheetIndependents: IRowIndependentReference,
  independentDependents: IIndependentDependentReferenceMap,
  rowIndex: IRowIndex
): IAddressReference[] => {
  const row = sheetIndependents[rowIndex]
  let addressReferences: IAddressReference[] = []

  if (row)
    Object.keys(row).forEach((columnIndex) => {
      addressReferences = addressReferences.concat(
        createDependentAddressReferences(
          row,
          independentDependents,
          +columnIndex
        )
      )
    })

  return addressReferences
}

export const createSheetAddressReferences = (
  independents: IIndependentReferences,
  independentDependents: IIndependentDependentReferenceMap,
  sheetName: ISheetName
) => {
  const sheetIndependents = independents[sheetName]
  let addressReferences: IAddressReference[] = []

  if (sheetIndependents)
    Object.keys(sheetIndependents).forEach((rowIndex) => {
      addressReferences = addressReferences.concat(
        createIndependentRowAddressReferences(
          sheetIndependents,
          independentDependents,
          +rowIndex
        )
      )
    })

  return addressReferences
}

export const createWorkbookAddressReferences = (
  independents: IIndependentReferences,
  independentDependents: IIndependentDependentReferenceMap
) => {
  let addressReferences: IAddressReference[] = []

  Object.keys(independents).forEach((sheetName) => {
    addressReferences = addressReferences.concat(
      createSheetAddressReferences(
        independents,
        independentDependents,
        sheetName
      )
    )
  })

  return addressReferences
}
