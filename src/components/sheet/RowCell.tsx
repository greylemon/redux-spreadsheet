import React, { FunctionComponent } from 'react'

import { ICellProps } from '../../@types/components'

const RowCell: FunctionComponent<ICellProps> = ({ style, rowIndex }) => {
  return (
    <div className="unselectable cell cellHeader cellHeader--row" style={style}>
      {rowIndex}
    </div>
  )
}

export default RowCell
