import React, { FunctionComponent } from 'react'
import { MenuItem } from 'react-contextmenu'

export const CustomMenuItem: FunctionComponent<{
  IconComponent?: FunctionComponent
  text: string
}> = ({ IconComponent, text }) => (
  <MenuItem className="contextMenu__menu">
    {IconComponent && <IconComponent />}
    {text}
  </MenuItem>
)
