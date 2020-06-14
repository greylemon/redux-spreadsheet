import React from 'react'

// import './styles/styles.scss'
import './styles/styles.scss'

import WindowListener from './WindowListener'
import SheetContainer from './Sheet/Sheet'
import ToolBar from './ToolBar/ToolBar'

const Excel = () => {
  return (
    <div className="view">
      <ToolBar />
      <SheetContainer />
      <WindowListener />
    </div>
  )
}

export default Excel
