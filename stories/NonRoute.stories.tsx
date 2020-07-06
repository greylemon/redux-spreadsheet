import React from 'react'
import { Excel } from '../src/Excel'
import { IHandleSave } from '../src/@types/functions'
import { initialExcelState } from '../src/redux/store'

export const NonRoute: any = () => {
  const handleSave: IHandleSave = () =>
    // _excelState: IExcelState
    {
      return
    }

  return <Excel initialState={initialExcelState} handleSave={handleSave} />
}
