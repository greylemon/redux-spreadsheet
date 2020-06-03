import React, { MouseEvent } from 'react'
import { ICell } from '../../../@types/excel/components'
import { useDispatch } from 'react-redux'
import { ExcelStore } from '../../../store/ExcelStore/store'

const EditableCell = ({ style, data, columnIndex, rowIndex }: ICell) => {
  const dispatch = useDispatch()

  const { data: sheetData } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData ? rowData[columnIndex] : {}

  const { value } = cellData

  const position = { x: columnIndex, y: rowIndex }

  const handleMouseDown = (event: MouseEvent) => {
    const { ctrlKey, shiftKey } = event

    if (ctrlKey) {
    } else if (shiftKey) {
      dispatch(ExcelStore.actions.CELL_MOUSE_DOWN_SHIFT(position))
    } else {
      dispatch(ExcelStore.actions.CELL_MOUSE_DOWN(position))
    }
  }

  const handleMouseEnter = (event: MouseEvent) => {
    if (event.buttons === 1)
      dispatch(ExcelStore.actions.CELL_MOUSE_ENTER(position))
  }

  const handleMouseUp = (event: MouseEvent) => {
    dispatch(ExcelStore.actions.CELL_MOUSE_UP())
  }

  return (
    <div
      className="unselectable cell"
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    >
      {value}
    </div>
  )
}

export default EditableCell
