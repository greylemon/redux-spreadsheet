import React, { FunctionComponent } from 'react'
import { Button } from '@material-ui/core'
import { STYLE_TOOLBAR_BUTTON } from '../../constants/styles'

export const SmallLabelButton: FunctionComponent<{ children: JSX.Element }> = ({
  children,
}) => (
  <Button style={STYLE_TOOLBAR_BUTTON} component="label" size="small">
    {children}
  </Button>
)
