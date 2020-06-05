import React from 'react'
import { ICellProps } from '../../../@types/excel/components'
import { columnNumberToName } from '../tools/conversion'

const ColumnCell = ({ style, columnIndex }: ICellProps) => {
  const columnName = columnNumberToName(columnIndex)

  return (
    <div className="unselectable cell cell__header" style={style}>
      {columnName}
    </div>
  )
}

export default ColumnCell
