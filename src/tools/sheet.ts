import { sheetNameRegex } from './regex'
import { ISheetNames, ISheetName } from '../@types/state'

export const generateNewSheetName = (sheetNames: ISheetNames): ISheetName => {
  let uniqueSheetNumber = sheetNames.length + 1

  sheetNames.forEach((name) => {
    const match = name.match(sheetNameRegex)

    if (match && uniqueSheetNumber <= +match[1]) uniqueSheetNumber++
  })

  return `Sheet${uniqueSheetNumber}`
}
