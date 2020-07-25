import { IExcelState, ICell, IRichTextValue } from '../../@types/state'
import { nSelectActiveSheetData } from './selectors'
import { getCellMapSetFromState } from './area'
import { ISetInlineStyleFn } from '../../@types/functions'
import { TYPE_RICH_TEXT } from '../../constants/types'

export const setBlockFactoryStyle = (setInlineStyleFn: ISetInlineStyleFn) => (
  cell: ICell
): ICell => {
  if (cell.style === undefined) cell.style = {}
  if (cell.style.font === undefined) cell.style.font = {}

  setInlineStyleFn(cell.style.font)

  return cell
}

export const setRichTextFactoryStyle = (
  setInlineStyleFn: ISetInlineStyleFn
) => (cell: ICell): ICell => {
  const cellValue = cell.value as IRichTextValue

  cellValue.forEach((block) => {
    block.fragments.forEach((fragment) => {
      if (fragment.styles === undefined) fragment.styles = {}
      setInlineStyleFn(fragment.styles)
    })
  })

  return cell
}

export const factorySetFontStyle = (setInlineStyleFn: ISetInlineStyleFn) => (
  cell: ICell
): ICell => {
  switch (cell.type) {
    case TYPE_RICH_TEXT:
      cell = setRichTextFactoryStyle(setInlineStyleFn)(cell)
      break
    default:
      cell = setBlockFactoryStyle(setInlineStyleFn)(cell)
      break
  }

  return cell
}

export const createFactoryReducerSetCellData = (
  setterFunction: (cell: ICell) => ICell
) => (state: IExcelState): IExcelState => {
  const activeSheetData = nSelectActiveSheetData(state)
  const cellMapSet = getCellMapSetFromState(state)

  for (const rowIndex in cellMapSet) {
    if (activeSheetData[rowIndex] === undefined) activeSheetData[rowIndex] = {}

    const row = activeSheetData[+rowIndex]
    const rowSet = cellMapSet[rowIndex]

    rowSet.forEach((columnIndex) => {
      if (row[columnIndex] === undefined) row[columnIndex] = {}

      row[columnIndex] = setterFunction(row[columnIndex])
    })
  }

  return state
}
