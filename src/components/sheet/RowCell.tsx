import React, { FunctionComponent } from 'react'

import { ICellProps } from '../../@types/components'

const RowCell: FunctionComponent<ICellProps> = ({ style, rowIndex }) => {
  return (
    <div className="unselectable cell cell__header" style={style}>
      {rowIndex}
    </div>
  )
}

export default RowCell
