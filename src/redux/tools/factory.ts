import { PayloadAction } from '@reduxjs/toolkit'
import { IExcelState, ICell, IRichTextValue } from '../../@types/state'
import { nSelectActiveSheetData } from './selectors'
import { getCellMapSetFromState } from './area'
import { ISetInlineStyleFn } from '../../@types/functions'
import { TYPE_RICH_TEXT } from '../../constants/types'
import { IGeneralActionPayload } from '../../@types/history'

export const setFontBlockFactoryStyle = (
  setInlineStyleFn: ISetInlineStyleFn
) => (cell: ICell): ICell => {
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
      cell = setFontBlockFactoryStyle(setInlineStyleFn)(cell)
      break
  }

  return cell
}

export const unsetRichTextFactoryStyle = (
  unsetInlineStyleFn: ISetInlineStyleFn
) => (cell: ICell): ICell => {
  const cellValue = cell.value as IRichTextValue

  cellValue.forEach((block) => {
    block.fragments.forEach((fragment) => {
      if (fragment.styles) unsetInlineStyleFn(fragment.styles)
    })
  })

  return cell
}

export const unsetFontBlockStyleFactory = (
  unsetInlineStyleFn: ISetInlineStyleFn
) => (cell: ICell): ICell => {
  if (cell.style === undefined) cell.style = {}
  if (cell.style.font === undefined) cell.style.font = {}

  if (cell.style && cell.style.font) unsetInlineStyleFn(cell.style.font)

  return cell
}

export const unsetFontStyleFactory = (
  unsetInlineStyleFn: ISetInlineStyleFn
) => (cell: ICell): ICell => {
  switch (cell.type) {
    case TYPE_RICH_TEXT:
      cell = unsetRichTextFactoryStyle(unsetInlineStyleFn)(cell)
      break
    default:
      cell = unsetFontBlockStyleFactory(unsetInlineStyleFn)(cell)
      break
  }

  return cell
}

export const createFactoryReducerSetCellData = (
  setterFunction: (cell: ICell) => ICell
) => (
  state: IExcelState,
  action: PayloadAction<IGeneralActionPayload>
): IExcelState => {
  const { activeCellPosition, inactiveSelectionAreas } = action.payload
  state.inactiveSelectionAreas = inactiveSelectionAreas
  state.activeCellPosition = activeCellPosition

  const activeSheetData = nSelectActiveSheetData(state)
  const cellMapSet = getCellMapSetFromState(state)

  Object.keys(cellMapSet).forEach((rowIndex) => {
    if (activeSheetData[rowIndex] === undefined) activeSheetData[rowIndex] = {}

    const row = activeSheetData[+rowIndex]
    const rowSet = cellMapSet[rowIndex]

    rowSet.forEach((columnIndex) => {
      if (row[columnIndex] === undefined) row[columnIndex] = {}

      row[columnIndex] = setterFunction(row[columnIndex])
    })
  })

  return state
}

export const createFactoryReducerUnsetCellData = (
  unsetterFunction: (cell: ICell) => ICell
) => (
  state: IExcelState,
  action: PayloadAction<IGeneralActionPayload>
): IExcelState => {
  const { activeCellPosition, inactiveSelectionAreas } = action.payload
  state.inactiveSelectionAreas = inactiveSelectionAreas
  state.activeCellPosition = activeCellPosition

  const activeSheetData = nSelectActiveSheetData(state)
  const cellMapSet = getCellMapSetFromState(state)

  Object.keys(cellMapSet).forEach((rowIndex) => {
    const row = activeSheetData[+rowIndex]
    const rowSet = cellMapSet[rowIndex]

    if (row) {
      rowSet.forEach((columnIndex) => {
        if (row[columnIndex]) {
          row[columnIndex] = unsetterFunction(row[columnIndex])
        }
      })
    }
  })

  return state
}
