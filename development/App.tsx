import React from 'react'
import { Excel } from '../src/Excel'
import './App.scss'
import { IExcelState } from '../src/@types/state'

function App() {
  const handleSave = (_excelState: IExcelState) => {}

  return (
    <div className="App">
      <Excel handleSave={handleSave} />
    </div>
  )
}

export default App
