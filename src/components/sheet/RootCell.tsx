import React, { FunctionComponent } from 'react'
import { ICellProps } from '../../@types/components'

const RootCell: FunctionComponent<ICellProps> = ({ style }) => {
  return <div className="unselectable cell cell__header" style={style} />
}

export default RootCell
