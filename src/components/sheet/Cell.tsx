import React, { FunctionComponent, useMemo } from 'react'
import { ICellProps } from '../../@types/components'
import EditableCell from './EditableCell'
import RowCell from './RowCell'
import ColumnCell from './ColumnCell'
import RootCell from './RootCell'

const Cell: FunctionComponent<ICellProps> = ({
  data,
  style,
  columnIndex,
  rowIndex,
}) => {
  const CellComponent = useMemo(() => {
    let Component: FunctionComponent<ICellProps>
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
      data={data}
      style={style}
      columnIndex={columnIndex}
      rowIndex={rowIndex}
    />
  )
}

export default Cell
