import { IColumnIndex, IAreaRange } from '../@types/state'
import { columnNameRegex } from './regex'
import { isFloat } from './validation'
import { convertStringPositionToPosition } from './parser'
import { getAreaRanges } from '../redux/tools/area'

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
    sum = sum * 26
    sum = sum + (name[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1)
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

export const addressRangeToRange = (range: string): IAreaRange => {
  const [topLeftAdr, bottomRightAdr] = range.split(':')

  return getAreaRanges({
    start: convertStringPositionToPosition(topLeftAdr),
    end: convertStringPositionToPosition(bottomRightAdr),
  })
}
