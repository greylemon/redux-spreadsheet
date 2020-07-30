import React, { FunctionComponent } from 'react'
import { ICellProps } from '../../@types/components'
import { columnNumberToName } from '../../tools/conversion'
import { columnDraggerStyle } from '../../constants/styles'
import HeaderDraggerArea from './HeaderDraggerArea'

const ColumnCell: FunctionComponent<ICellProps> = ({ style, columnIndex }) => {
  const columnName = columnNumberToName(columnIndex)

  return (
    <div
      className="unselectable cell cellHeader cellHeader__column"
      style={style}
    >
      <span id={`column={"x":${columnIndex}}`}>{columnName}</span>
      <HeaderDraggerArea
        id={`column_dragger={"x":${columnIndex}}`}
        type="column"
        style={columnDraggerStyle}
        index={columnIndex}
      />
    </div>
  )
}

export default ColumnCell
