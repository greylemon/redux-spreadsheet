import React from 'react'

import { ICell } from '../../../@types/excel/components'

const RowCell = ({ style, rowIndex }: ICell) => {
  return (
    <div className="unselectable cell cell__header" style={style}>
      {rowIndex}
    </div>
  )
}

export default RowCell
