import React, { FunctionComponent } from 'react'
import { Excel } from '../Excel'
// // import { IExcelState } from '../src/@types/state'
import { IHandleSave } from '../@types/functions'

export const NonRoute: FunctionComponent = () => {
  const handleSave: IHandleSave = () =>
    // _excelState: IExcelState
    {
      return
    }

  return (
    <div className="App" style={{ height: '100%' }}>
      <Excel handleSave={handleSave} />
    </div>
  )
}
