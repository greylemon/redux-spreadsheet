import React from 'react'
import Sheet from './Sheet'

// import './styles/styles.scss'
import './styles/styles.scss'

import WindowListener from './WindowListener'

const Excel = () => {
  return (
    <div className="view">
      <Sheet />
      <WindowListener />
    </div>
  )
}

export default Excel
