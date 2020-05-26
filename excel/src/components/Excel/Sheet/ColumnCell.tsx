import React from 'react'
import { ICell } from '../../../@types/excel/components'
import { columnNumberToName } from '../tools/conversion'

const ColumnCell = ({ style, columnIndex }: ICell) => {
  const columnName = columnNumberToName(columnIndex)

  return (
    <div className="unselectable cell cell__header" style={style}>
      {columnName}
    </div>
  )
}

export default ColumnCell
