import React from 'react'
import logo from './logo.svg'
import './App.css'
import Excel from 'spreadsheet-redux'
import undox from 'undox'

function App() {
  console.log(Excel)
  return (
    <div className="App">
      <Excel />
    </div>
  )
}

export default App
