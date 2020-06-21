import React from 'react'
import { ICellProps } from '../../@types/components'

const RootCell = ({ style }: ICellProps) => {
  return <div className="unselectable cell cell__header" style={style} />
}

export default RootCell
