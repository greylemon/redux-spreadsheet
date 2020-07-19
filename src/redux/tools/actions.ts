import { ExcelActions } from '../store'
import { Action } from '@reduxjs/toolkit'

export const createActionIgnoreMap = (): { [key: string]: boolean } => {
  const ignoreActionMap = {}

  for (const actionKey in ExcelActions) {
    const action: Action = ExcelActions[actionKey]
    ignoreActionMap[action.type] = true
  }

  // TODO : Ignore certain actions here

  return ignoreActionMap
}
