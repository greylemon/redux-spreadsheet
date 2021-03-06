import { PayloadAction } from '@reduxjs/toolkit'
import { IExcelState, ISheetName } from '../../@types/state'
import { createSheetState } from '../tools/state'
import { changeSheetInPlace } from '../tools/sheet'
import { deleteSheetRef } from '../../tools/formula/formula'

export const CHANGE_SHEET_ORDER = (
  state: IExcelState,
  action: PayloadAction<{ oldIndex: number; newIndex: number }>
): IExcelState => {
  const { oldIndex, newIndex } = action.payload

  const sheetName = state.sheetNames[oldIndex]

  const newSheetNames = state.sheetNames.filter((name) => name !== sheetName)

  newSheetNames.splice(newIndex, 0, sheetName)

  state.sheetNames = newSheetNames

  return state
}

export const CHANGE_SHEET = (
  state: IExcelState,
  action: PayloadAction<ISheetName>
): IExcelState => {
  const sheetName = action.payload

  state.isSheetNameEdit = false
  state.sheetNameText = ''

  changeSheetInPlace(sheetName, state)

  return state
}

export const ADD_SHEET = (
  state: IExcelState,
  action: PayloadAction<ISheetName>
): IExcelState => {
  const newSheetName = action.payload

  state.sheetNames.push(newSheetName)

  state.sheetsMap[newSheetName] = createSheetState()

  changeSheetInPlace(newSheetName, state)

  return state
}

// TODO : Update reference sheetname
export const DELETE_SHEET = (state: IExcelState): IExcelState => {
  const { sheetNames } = state

  const sheetIndex = sheetNames.findIndex(
    (sheetName) => sheetName === state.activeSheetName
  )

  const sheetName = sheetNames[sheetIndex]

  state.sheetNames = [
    ...sheetNames.slice(0, sheetIndex),
    ...sheetNames.slice(sheetIndex + 1),
  ]

  const newActiveSheet =
    state.sheetNames[sheetIndex - 1 >= 0 ? sheetIndex - 1 : sheetIndex]

  changeSheetInPlace(newActiveSheet, state)

  delete state.sheetsMap[sheetName]

  deleteSheetRef(
    sheetName,
    state.sheetsMap,
    state.dependentReferences,
    state.independentReferences,
    state.independentDependentReferences,
    state.sheetToIndependentDependentMap,
    state.results
  )

  return state
}

export const OPEN_SHEET_NAVIGATION_OPTION = (
  state: IExcelState
): IExcelState => {
  state.isSheetNavigationOpen = true

  return state
}

export const CLOSE_SHEET_NAVIGATION_OPTION = (
  state: IExcelState
): IExcelState => {
  state.isSheetNavigationOpen = false

  return state
}

export const ENABLE_SHEET_NAME_EDIT = (state: IExcelState): IExcelState => {
  state.isSheetNameEdit = true
  state.sheetNameText = state.activeSheetName
  state.isSheetNavigationOpen = false

  return state
}

export const DISABLE_SHEET_NAME_EDIT = (state: IExcelState): IExcelState => {
  state.isSheetNameEdit = false
  state.sheetNameText = ''
  return state
}

export const CHANGE_SHEET_NAME_TEXT = (
  state: IExcelState,
  action: PayloadAction<string>
): IExcelState => {
  state.sheetNameText = action.payload
  return state
}

export const RESET_SHEET_NAME_EDIT = (state: IExcelState): IExcelState => {
  state.isSheetNameEdit = false
  state.sheetNameText = ''
  return state
}

// TODO : Update reference sheetname
export const CHANGE_ACTIVE_SHEET_NAME = (
  state: IExcelState,
  action: PayloadAction<ISheetName>
): IExcelState => {
  const { activeSheetName } = state
  const newActiveSheetName = action.payload
  const { sheetNames } = state

  state.isSheetNameEdit = false
  state.sheetNameText = ''

  if (sheetNames.includes(newActiveSheetName)) return state

  const sheetIndex = sheetNames.findIndex(
    (sheetName) => sheetName === state.activeSheetName
  )

  state.sheetNames = [
    ...sheetNames.slice(0, sheetIndex),
    newActiveSheetName,
    ...sheetNames.slice(sheetIndex + 1),
  ]

  state.sheetsMap[newActiveSheetName] = state.sheetsMap[activeSheetName]
  delete state.sheetsMap[activeSheetName]
  state.activeSheetName = newActiveSheetName

  return state
}
