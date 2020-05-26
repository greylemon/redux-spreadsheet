import React from 'react'
import { ICell } from '../../../@types/excel/components'

const ColumnCell = ({ style }: ICell) => {
  return (
    <div className="unselectable" style={style}>
      col
    </div>
  )
}

export default ColumnCell
