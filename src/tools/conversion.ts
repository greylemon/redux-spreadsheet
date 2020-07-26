import { IColumnIndex, IAreaRange, IPosition } from '../@types/state'
import { columnNameRegex, numberRegex } from './regex'
import { isFloat } from './validation'
import { getAreaRanges } from './area'

/**
 * Convert a column name to a number.
 * ! Taken from xlsx-populate/lib/addressConverter
 */
export const columnNameToNumber = (
  name: string | undefined
): IColumnIndex | null => {
  if (
    name === undefined ||
    typeof name !== 'string' ||
    !columnNameRegex.test(name)
  )
    return null

  name = name.toUpperCase()
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum *= 26
    sum += name[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1
  }

  return sum
}

/**
 * Convert a column number to a name.
 * ! Taken from xlsx-populate/lib/addressConverter
 */
export const columnNumberToName = (number: number): string | null => {
  if (number < 1 || isFloat(number)) return null

  let dividend = number
  let name = ''
  let modulo = 0

  while (dividend > 0) {
    modulo = (dividend - 1) % 26
    name = String.fromCharCode('A'.charCodeAt(0) + modulo) + name
    dividend = Math.floor((dividend - modulo) / 26)
  }

  return name
}

export const convertAddressRangeToRange = (range: string): IAreaRange => {
  const [topLeftAdr, bottomRightAdr] = range.split(':')

  return getAreaRanges({
    start: convertStringPositionToPosition(topLeftAdr),
    end: convertStringPositionToPosition(bottomRightAdr),
  })
}

export const convertStringPositionToPosition = (
  stringPosition: string
): IPosition => {
  const rowStartIndex = stringPosition.search(numberRegex)
  const columnLetter = stringPosition.substring(0, rowStartIndex)

  return {
    x: getColumnNumberFromColumnName(columnLetter),
    y: +stringPosition.substring(rowStartIndex, stringPosition.length),
  }
}

export const getColumnNumberFromColumnName = (name: string): IColumnIndex => {
  let sum = 0

  for (let i = 0; i < name.length; i++) {
    sum *= 26
    sum += name.charCodeAt(i) - ('A'.charCodeAt(0) - 1)
  }

  return sum
}
