import React, { FunctionComponent } from 'react'
import { Description } from '@material-ui/icons'
import { SmallLabelButton } from '../misc/buttons'
import STYLE_APP_BAR, {
  STYLE_APP_BAR_ICON,
  STYLE_APP_BAR_BUTTON_ICON,
  STYLE_APP_BAR_CONTENT,
} from './style'
import AppBarMenu from './AppBarMenu'
import AppBarName from './AppBarName'
import { ISheetRef } from '../../@types/ref'

const SpreadSheetButton: FunctionComponent = () => {
  return (
    <SmallLabelButton title="Home" style={STYLE_APP_BAR_BUTTON_ICON}>
      <Description style={STYLE_APP_BAR_ICON} />
    </SmallLabelButton>
  )
}

const AppBarContent: FunctionComponent<{ sheetRef: ISheetRef }> = ({
  sheetRef,
}) => (
  <div style={STYLE_APP_BAR_CONTENT}>
    <AppBarName sheetRef={sheetRef} />
    <AppBarMenu />
  </div>
)

const AppBar: FunctionComponent<{ sheetRef: ISheetRef }> = ({ sheetRef }) => (
  <div style={STYLE_APP_BAR}>
    <SpreadSheetButton />
    <AppBarContent sheetRef={sheetRef} />
  </div>
)

export default AppBar
