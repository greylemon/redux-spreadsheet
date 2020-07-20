import React, { FunctionComponent } from 'react'
import toolBar, { toolBar__content } from './style'
import { Divider } from '@material-ui/core'
import HistorySection from './HistorySection'
import IOSection from './IOSection'
import BlockStyleSection from './BlockStyleSection'

const VerticalDivider: FunctionComponent = () => (
  <Divider orientation="vertical" flexItem />
)

const ToolBar: FunctionComponent = () => (
  <div style={toolBar}>
    <div style={toolBar__content}>
      <HistorySection />
      <VerticalDivider />
      <IOSection />
      <VerticalDivider />
      <BlockStyleSection />
    </div>
  </div>
)

export default ToolBar
