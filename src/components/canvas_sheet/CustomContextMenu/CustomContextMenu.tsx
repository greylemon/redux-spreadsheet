import React, { FunctionComponent } from 'react'
import { ContextMenu } from 'react-contextmenu'
import { Paper } from '@material-ui/core'
import { contextMenuId } from '../../../constants/misc'
import { Insert } from './Insert'
import { STYLE_CONTEXT_MENU } from './style'

const CustomContextMenu: FunctionComponent = () => {
  return (
    <ContextMenu id={contextMenuId}>
      <Paper
        style={STYLE_CONTEXT_MENU}
        className="contextMenu"
        tabIndex={undefined}
      >
        <Insert />
      </Paper>
    </ContextMenu>
  )
}

export default CustomContextMenu
