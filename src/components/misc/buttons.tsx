import React, { FunctionComponent, MouseEvent } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { STYLE_TOOLBAR_BUTTON } from '../../constants/styles'
import { toggledOn } from '../toolBar/style'

export const SmallLabelButton: FunctionComponent<{
  children: JSX.Element
  title: string
  isToggled?: boolean
  onClick?: (event: MouseEvent) => void
}> = ({ children, title, onClick, isToggled = false }) => (
  <Tooltip title={title}>
    <Button
      style={{
        ...STYLE_TOOLBAR_BUTTON,
        ...(isToggled ? toggledOn : undefined),
      }}
      component="label"
      size="small"
      onClick={onClick}
    >
      {children}
    </Button>
  </Tooltip>
)
