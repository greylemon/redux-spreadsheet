import React from 'react'
import { ICell } from '../../../@types/excel/components'

const EditableCell = ({ style, data, columnIndex, rowIndex }: ICell) => {
  const { data: sheetData } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData ? rowData[columnIndex] : {}

  const { value } = cellData

  return (
    <div className="unselectable cell" style={style}>
      {value}
    </div>
  )
}

export default EditableCell
