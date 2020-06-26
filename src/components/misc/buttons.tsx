import React, { FunctionComponent } from 'react'
import { Button } from '@material-ui/core'

export const SmallLabelButton: FunctionComponent<{ children: JSX.Element }> = ({
  children,
}) => (
  <Button component="label" size="small">
    {children}
  </Button>
)
