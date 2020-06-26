import React, { FunctionComponent, CSSProperties } from 'react'

import './styles/styles.scss'

import WindowListener from './components/WindowListener'
import SheetContainer from './components/Sheet/Sheet'
import ToolBar from './components/ToolBar/ToolBar'
import SheetNavigation from './components/SheetNavigation/SheetNavigation'

const ExcelContent: FunctionComponent<{ style?: CSSProperties }> = ({
  style,
}) => (
  <div className="excel" style={style}>
    <ToolBar />
    <SheetContainer />
    <SheetNavigation />
    <WindowListener />
  </div>
)

export default ExcelContent
