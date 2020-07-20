import React, { FunctionComponent } from 'react'
import { Excel } from '../src/Excel'
import { IHandleSave } from '../src/@types/functions'

const App: FunctionComponent = () => {
  const handleSave: IHandleSave = () =>
    // _excelState: IExcelState
    {
      return
    }

  return (
    <div>
      <Excel handleSave={handleSave} />
    </div>
  )
}

export default App
