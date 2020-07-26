import React, { FunctionComponent } from 'react'
import { Description } from '@material-ui/icons'
import { SmallLabelButton } from '../misc/buttons'
import STYLE_APP_BAR, {
  STYLE_APP_BAR_ICON,
  STYLE_APP_BAR_BUTTON_ICON,
  // appBarContentStyle,
} from './style'
// import AppBarMenu from './AppBarMenu'
// import AppBarName from './AppBarName'

const SpreadSheetButton: FunctionComponent = () => {
  return (
    <SmallLabelButton title="Home" style={STYLE_APP_BAR_BUTTON_ICON}>
      <Description style={STYLE_APP_BAR_ICON} />
    </SmallLabelButton>
  )
}

// const AppBarContent: FunctionComponent = () => (
//   <div style={appBarContentStyle}>
//     <AppBarName />
//     <AppBarMenu />
//   </div>
// )

const AppBar: FunctionComponent = () => (
  <div style={STYLE_APP_BAR}>
    <SpreadSheetButton />
    {/* <AppBarContent /> */}
  </div>
)

export default AppBar
