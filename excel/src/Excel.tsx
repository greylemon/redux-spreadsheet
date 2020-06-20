import React from 'react'

import './styles/styles.scss'

import WindowListener from './components/WindowListener'
import SheetContainer from './components/Sheet/Sheet'
import ToolBar from './components/ToolBar/ToolBar'
import SheetNavigation from './components/SheetNavigation/SheetNavigation'

const Excel = () => (
  <div className="excel">
    <ToolBar />
    <SheetContainer />
    <SheetNavigation />
    <WindowListener />
  </div>
)

export default Excel
