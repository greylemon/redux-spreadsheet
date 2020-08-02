import React, { FunctionComponent, useMemo } from 'react'
import { Group, Layer } from 'react-konva'
import { IRowOffsets, IColumnOffsets } from '../../@types/state'
import { IGetRowHeight, IGetColumnWidth } from '../../@types/functions'
import { Cell } from './ContainerCell'

const GenericPane: FunctionComponent<{
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
}> = ({
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,
}) => {
  const Rows = useMemo(() => {
    const RowList: JSX.Element[] = []
    for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex += 1) {
      const ColumnList: JSX.Element[] = []
      for (
        let columnIndex = columnStart;
        columnIndex < columnEnd;
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

      RowList.push(
        <Group key={`sheet-top-left-row-${rowIndex}`}>{ColumnList}</Group>
      )
    }

    return RowList
  }, [
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
    rowOffsets,
    columnOffsets,
    getColumnWidth,
    getRowHeight,
  ])

  return (
    <Layer>
      <Group>{Rows}</Group>
    </Layer>
  )
}

export default GenericPane
