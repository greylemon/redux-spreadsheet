import React from 'react'

import { ICellProps } from '../../@types/components'

const RowCell = ({ style, rowIndex }: ICellProps) => {
  return (
    <div className="unselectable cell cell__header" style={style}>
      {rowIndex}
    </div>
  )
}

export default RowCell
