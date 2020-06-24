import React from 'react';
import { ExcelComponent } from 'spreadsheet-redux'
import './App.css';
import '../node_modules/spreadsheet-redux/dist/main.cjs.css'

function App() {
  return (
    <div className="App">
      <ExcelComponent/>
    </div>
  );
}

export default App;
