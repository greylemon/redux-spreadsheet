import React, { FunctionComponent } from 'react'
import { ICellProps } from '../../@types/components'

const RootCell: FunctionComponent<ICellProps> = ({ style }) => {
  return (
    <div
      id={`root={"x":0,"y":0}`}
      className="unselectable cell cellHeader cellHeader--root"
      style={style}
    />
  )
}

export default RootCell
