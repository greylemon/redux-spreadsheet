import React, { FunctionComponent } from 'react'

import { ICellProps } from '../../@types/components'
import HeaderDraggerArea from './HeaderDraggerArea'
import { rowDraggerStyle } from '../../constants/styles'

const RowCell: FunctionComponent<ICellProps> = ({ style, rowIndex }) => {
  return (
    <div
      id={`row={"y":${rowIndex}}`}
      className="unselectable cell cellHeader cellHeader--row"
      style={style}
    >
      {rowIndex}
      <HeaderDraggerArea
        id={`row_dragger={"y":${rowIndex}}`}
        type="row"
        style={rowDraggerStyle}
        index={rowIndex}
      />
    </div>
  )
}

export default RowCell
