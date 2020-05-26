import React from 'react'

import { ICell } from '../../../@types/excel/components'

const RowCell = ({ style }: ICell) => {
  return (
    <div className="unselectable" style={style}>
      row
    </div>
  )
}

export default RowCell
