export const ASCIIRegex = /[ -~]/
export const numberRegex = /[0-9]/
export const exactNumberRegex = /^[0-9]+$/

export const columnNameRegex = /^[A-Z]+$/
export const cellRegex = /[A-Z]+[1-9][0-9]*/
export const rangeRegex = /[A-Z]+[1-9][0-9]*:[A-Z]+[1-9][0-9]*/

// Sheet name regex - does not consider empty
// (('([a-zA-Z0-9]|[-!$%^&()_+|~=`{}:";<>,.])+')|(([a-zA-Z0-9])+))!

// reference cell/range regex
// (([A-Z]+[1-9][0-9]*):([A-Z]+[1-9][0-9]*)|([A-Z]+[1-9][0-9]*))?

export const sheetNameAdressRegex = /((('([a-zA-Z0-9]|[-!$%^&@()_+|~=`{}:";<>,.])+')|(([a-zA-Z0-9])+))!)?(([A-Z]+[1-9][0-9]*):([A-Z]+[1-9][0-9]*)|([A-Z]+[1-9][0-9]*))/g

export const sheetNameRegex = /^Sheet(\d+)$/
