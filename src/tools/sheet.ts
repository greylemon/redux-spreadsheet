import { normalSheetNameRegex } from './regex'
import { ISheetNames, ISheetName } from '../@types/state'

export const generateNewSheetName = (sheetNames: ISheetNames): ISheetName => {
  let uniqueSheetNumber = sheetNames.length + 1

  sheetNames.forEach((name) => {
    const match = name.match(normalSheetNameRegex)

    if (match && uniqueSheetNumber <= +match[1]) uniqueSheetNumber++
  })

  return `Sheet${uniqueSheetNumber}`
}
