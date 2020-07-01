import React, { FunctionComponent } from 'react'
import { Excel } from '../src/Excel'
import './App.scss'
// import { IExcelState } from '../src/@types/state'
import { IHandleSave } from '../src/@types/functions'

const App: FunctionComponent = () => {
  const handleSave: IHandleSave = () =>
    // _excelState: IExcelState
    {
      return
    }

  return (
    <div className="App">
      <Excel handleSave={handleSave} />
    </div>
  )
}

export default App
