import React, { FunctionComponent } from 'react'
import { SmallLabelButton } from '../misc/buttons'
import { Description } from '@material-ui/icons'
import appBarStyle, {
  appBarIconStyle,
  appBarButtonIconStyle,
  // appBarContentStyle,
} from './style'
// import AppBarMenu from './AppBarMenu'
// import AppBarName from './AppBarName'

const SpreadSheetButton: FunctionComponent = () => {
  return (
    <SmallLabelButton title="Home" style={appBarButtonIconStyle}>
      <Description style={appBarIconStyle} />
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
  <div style={appBarStyle}>
    <SpreadSheetButton />
    {/* <AppBarContent /> */}
  </div>
)

export default AppBar
