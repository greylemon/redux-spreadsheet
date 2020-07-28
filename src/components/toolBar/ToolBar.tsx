import React, { FunctionComponent } from 'react'
import { Divider } from '@material-ui/core'
import STYLE_TOOL_BAR, {
  STYLE_TOOL_BAR_CONTENT,
  STYLE_VERTICAL_DIVIDER,
} from './style'
import HistorySection from './HistorySection'
import IOSection from './IOSection'
import BlockStyleSection from './BlockStyleSection'
import AppearanceSection from './AppearanceSection'

const VerticalDivider: FunctionComponent = () => (
  <Divider style={STYLE_VERTICAL_DIVIDER} orientation="vertical" flexItem />
)

const ToolBar: FunctionComponent = () => (
  <div style={STYLE_TOOL_BAR}>
    <div style={STYLE_TOOL_BAR_CONTENT}>
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
