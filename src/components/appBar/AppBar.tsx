import React, { FunctionComponent, useCallback } from 'react'
import { Description } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { SmallLabelButton } from '../misc/buttons'
import STYLE_APP_BAR, {
  STYLE_APP_BAR_ICON,
  STYLE_APP_BAR_BUTTON_ICON,
  STYLE_APP_BAR_CONTENT,
} from './style'
import AppBarMenu from './AppBarMenu'
import AppBarName from './AppBarName'
import { ISheetRef } from '../../@types/ref'
import { IHandleSave } from '../../@types/functions'

const SpreadSheetButton: FunctionComponent<{
  returnLink: string
}> = ({ returnLink }) => {
  const history = useHistory()

  const handleClick = useCallback(() => {
    if (returnLink && history) history.push(returnLink)
  }, [returnLink, history])

  return (
    <SmallLabelButton
      title="Home"
      style={STYLE_APP_BAR_BUTTON_ICON}
      onClick={handleClick}
    >
      <Description style={STYLE_APP_BAR_ICON} />
    </SmallLabelButton>
  )
}

const AppBarContent: FunctionComponent<{
  sheetRef: ISheetRef
  handleSave: IHandleSave
}> = ({ sheetRef, handleSave }) => (
  <div style={STYLE_APP_BAR_CONTENT}>
    <AppBarName sheetRef={sheetRef} />
    <AppBarMenu handleSave={handleSave} />
  </div>
)

const AppBar: FunctionComponent<{
  returnLink?: string
  sheetRef: ISheetRef
  handleSave: IHandleSave
}> = ({ sheetRef, returnLink, handleSave }) => (
  <div style={STYLE_APP_BAR}>
    <SpreadSheetButton returnLink={returnLink} />
    <AppBarContent sheetRef={sheetRef} handleSave={handleSave} />
  </div>
)

export default AppBar
