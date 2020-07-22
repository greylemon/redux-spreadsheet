import React, { FunctionComponent, MouseEvent, CSSProperties } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { STYLE_TOOLBAR_BUTTON } from '../../constants/styles'
import { toggledOn, disabledStyle } from '../toolBar/style'

export const SmallLabelButton: FunctionComponent<{
  children: JSX.Element
  title: string
  style?: CSSProperties
  isToggled?: boolean
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
}> = ({ children, title, disabled, style, onClick, isToggled = false }) => (
  <Tooltip title={title}>
    <Button
      style={{
        ...STYLE_TOOLBAR_BUTTON,
        ...(isToggled ? toggledOn : undefined),
        ...(disabled ? disabledStyle : undefined),
        ...style,
      }}
      component="label"
      size="small"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  </Tooltip>
)
