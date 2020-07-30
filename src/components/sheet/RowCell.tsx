import React, { FunctionComponent } from 'react'

import { ICellProps } from '../../@types/components'
import HeaderDraggerArea from './HeaderDraggerArea'
import { rowDraggerStyle } from '../../constants/styles'

const RowCell: FunctionComponent<ICellProps> = ({ style, rowIndex }) => (
  <div className="unselectable cell cellHeader cellHeader__row" style={style}>
    <span id={`row={"y":${rowIndex}}`}>{rowIndex}</span>
    <HeaderDraggerArea
      id={`row_dragger={"y":${rowIndex}}`}
      type="row"
      style={rowDraggerStyle}
      index={rowIndex}
    />
  </div>
)

export default RowCell
