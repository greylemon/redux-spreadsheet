import React from 'react'

// import './styles/styles.scss'
import './styles/styles.scss'

import WindowListener from './WindowListener'
import SheetContainer from './Sheet/Sheet'
import ToolBar from './ToolBar/ToolBar'
import SheetNavigation from './SheetNavigation/SheetNavigation'

const Excel = () => {
  return (
    <div className="excel">
      <ToolBar />
      <SheetContainer />
      <SheetNavigation />
      <WindowListener />
    </div>
  )
}

export default Excel
