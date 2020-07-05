import React from 'react'
import { Excel } from '../src/Excel'
import { IHandleSave } from '../src/@types/functions'

export const NonRoute: any = () => {
  const handleSave: IHandleSave = () =>
    // _excelState: IExcelState
    {
      return
    }

  return <Excel isRouted={false} handleSave={handleSave} />
}
