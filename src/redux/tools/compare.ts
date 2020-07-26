import deepEqual from 'deep-equal'
import { ICell, IRichTextValue } from '../../@types/state'
import { TYPE_RICH_TEXT } from '../../constants/types'

export const isCellEqualOtherCell = (
  cell: ICell,
  otherCell: ICell
): boolean => {
  if (cell === otherCell || (cell === undefined && otherCell === undefined))
    return true

  if (cell === undefined || otherCell === undefined) return false

  if (cell.type !== otherCell.type) return false

  if (
    !deepEqual(cell.style, otherCell.style) ||
    !deepEqual(cell.merged, otherCell.merged)
  )
    return false

  if (cell.type === TYPE_RICH_TEXT) {
    const cellValue = cell.value as IRichTextValue
    const otherCellValue = otherCell.value as IRichTextValue

    if (cellValue.length !== otherCellValue.length) return false

    for (let i = 0; i < cellValue.length; i += 1) {
      const cellBlock = cellValue[i].fragments
      const otherCellBlock = otherCellValue[i].fragments

      if (cellBlock.length !== otherCellBlock.length) return false

      for (let j = 0; j < cellBlock.length; j += 1) {
        const cellFragment = cellBlock[j]
        const otherCellFragment = otherCellBlock[j]

        if (
          !deepEqual(cellFragment.styles, otherCellFragment.styles) ||
          !deepEqual(cellFragment.text, cellFragment.text)
        )
          return false
      }
    }
  } else if (cell.value !== otherCell.value) return false

  return true
}
