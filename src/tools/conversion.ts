import { IColumnIndex } from '../@types/state'

/**
 * Convert a column name to a number.
 * ! Taken from xlsx-populate/lib/addressConverter
 */
export const columnNameToNumber = (
  name: string | undefined
): IColumnIndex | undefined => {
  if (!name || typeof name !== 'string') return

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
export const columnNumberToName = (number: number): string => {
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
