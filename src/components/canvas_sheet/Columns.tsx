import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { IRowOffsets, IColumnOffsets } from '../../@types/state'
import { IGetRowHeight, IGetColumnWidth } from '../../@types/functions'
import { Cell } from './ContainerCell'

export const Columns: FunctionComponent<{
  tableColumnCount: number
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  rowIndex: number
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
}> = ({
  tableColumnCount,
  rowOffsets,
  columnOffsets,
  rowIndex,
  getColumnWidth,
  getRowHeight,
}) => {
  const ColumnComponents = useMemo(() => {
    const ColumnList: JSX.Element[] = []
    for (
      let columnIndex = 0;
      columnIndex <= tableColumnCount;
      columnIndex += 1
    ) {
      ColumnList.push(
        <Cell
          key={`sheet-columns-${columnIndex}`}
          rowOffsets={rowOffsets}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          columnOffsets={columnOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
        />
      )
    }

    return ColumnList
  }, [tableColumnCount])

  return <Group>{ColumnComponents}</Group>
}
