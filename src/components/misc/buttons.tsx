import React, { FunctionComponent, MouseEvent, CSSProperties } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { STYLE_TOOLBAR_BUTTON } from '../../constants/styles'
import { STYLE_TOGGLED, STYLE_DISABLED } from './style'

export const SmallLabelButton: FunctionComponent<{
  children: JSX.Element
  title: string
  style?: CSSProperties
  isToggled?: boolean
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMouseDown?: (event: MouseEvent) => void
}> = ({
  children,
  title,
  disabled,
  style,
  onClick,
  onMouseDown,
  isToggled = false,
}) => (
  <Tooltip title={title}>
    <Button
      style={{
        ...STYLE_TOOLBAR_BUTTON,
        ...(isToggled ? STYLE_TOGGLED : undefined),
        ...(disabled ? STYLE_DISABLED : undefined),
        ...style,
      }}
      component="label"
      size="small"
      onClick={onClick}
      onMouseDown={onMouseDown}
      disabled={disabled}
    >
      {children}
    </Button>
  </Tooltip>
)
