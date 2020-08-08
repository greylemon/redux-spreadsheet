import React, { FunctionComponent, useMemo } from 'react'
import RowCell from './RowCell'
import { ICanvasCellProps } from '../../../@types/components'
import ColumnCell from './ColumnCell'
import RootCell from './RootCell'
import EditableCell from './EditableCell'

const Cell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  height,
  width,
  columnIndex,
  rowIndex,
  data,
}) => {
  const CellComponent = useMemo(() => {
    let Component: FunctionComponent<ICanvasCellProps>
    if (columnIndex && rowIndex) {
      Component = EditableCell
    } else if (rowIndex) {
      Component = RowCell
    } else if (columnIndex) {
      Component = ColumnCell
    } else {
      Component = RootCell
    }

    return Component
  }, [columnIndex, rowIndex])

  return (
    <CellComponent
      x={x}
      y={y}
      width={width}
      height={height}
      columnIndex={columnIndex}
      rowIndex={rowIndex}
      data={data}
    />
  )
}

export default Cell
