import React, { FunctionComponent, CSSProperties } from 'react'

import './styles/styles.scss'

import WindowListener from './components/WindowListener'
import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
import FormulaBar from './components/formulaBar/FormulaBar'

const ExcelContent: FunctionComponent<{ style?: CSSProperties }> = ({
  style,
}) => (
  <div className="excel" style={style}>
    <ToolBar />
    {/* <FormulaBar /> */}
    <SheetContainer />
    <SheetNavigation />
    <WindowListener />
  </div>
)

export default ExcelContent
