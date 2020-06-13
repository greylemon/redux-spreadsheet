import React from 'react'

// import './styles/styles.scss'
import './styles/styles.scss'

import WindowListener from './WindowListener'
import SheetContainer from './Sheet/Sheet'

const Excel = () => {
  return (
    <div className="view">
      <SheetContainer />
      <WindowListener />
    </div>
  )
}

export default Excel
