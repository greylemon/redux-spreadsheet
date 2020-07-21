import React, { FunctionComponent } from 'react'
import { Divider } from '@material-ui/core'
import toolBar, { toolBar__content } from './style'
import HistorySection from './HistorySection'
import IOSection from './IOSection'
import BlockStyleSection from './BlockStyleSection'
import AppearanceSection from './AppearanceSection'

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
      <VerticalDivider />
      <AppearanceSection />
    </div>
  </div>
)

export default ToolBar
