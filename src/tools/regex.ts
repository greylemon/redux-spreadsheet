export const ASCIIRegex = /[ -~]/
export const numberRegex = /[0-9]/

export const cellRegex = /[A-Z]*[1-9][0-9]*/g
export const rangeRegex = /[A-Z]*[1-9][0-9]*:[A-Z]*[1-9][0-9]*/

// console.log(cellRegex.exec('A5,A8'))
// console.log('A5,A8'.match(cellRegex))
