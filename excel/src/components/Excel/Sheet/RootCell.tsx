import React from 'react'
import { ICell } from '../../../@types/excel/components'

const RootCell = ({ style }: ICell) => {
  return (
    <div className="unselectable" style={style}>
      root
    </div>
  )
}

export default RootCell
