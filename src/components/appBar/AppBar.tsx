import React, { FunctionComponent } from 'react'
import { SmallLabelButton } from '../misc/buttons'
import { Description } from '@material-ui/icons'
import STYLE_APP_BAR, {
  STYLE_APP_BAR__ICON,
  STYLE_APP_BAR__BUTTON_ICON,
  // appBarContentStyle,
} from './style'
// import AppBarMenu from './AppBarMenu'
// import AppBarName from './AppBarName'

const SpreadSheetButton: FunctionComponent = () => {
  return (
    <SmallLabelButton title="Home" style={STYLE_APP_BAR__BUTTON_ICON}>
      <Description style={STYLE_APP_BAR__ICON} />
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
