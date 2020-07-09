import React, { FunctionComponent } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { contextMenuId } from '../../constants/misc'
import { Paper } from '@material-ui/core'

// const CustomMenuItem: FunctionComponent = ({  }) => (
//   <MenuItem>

//   </MenuItem>
// )

const CustomContextMenu: FunctionComponent = () => {
  return (
    <ContextMenu id={contextMenuId}>
      <Paper className="contextMenu">
        <MenuItem>ContextMenu Item 1</MenuItem>
        <MenuItem>ContextMenu Item 2</MenuItem>
        <MenuItem divider />
        <MenuItem>ContextMenu Item 3</MenuItem>
      </Paper>
    </ContextMenu>
  )
}

export default CustomContextMenu
