import React, { FunctionComponent } from 'react'
import { ICellProps } from '../../@types/components'
import { columnNumberToName } from '../../tools/conversion'

const ColumnCell: FunctionComponent<ICellProps> = ({ style, columnIndex }) => {
  const columnName = columnNumberToName(columnIndex)

  return (
    <div className="unselectable cell cell__header" style={style}>
      {columnName}
    </div>
  )
}

export default ColumnCell
