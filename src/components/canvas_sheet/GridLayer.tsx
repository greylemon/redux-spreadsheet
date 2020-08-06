import React, { FunctionComponent, useMemo } from 'react'
import { Group, Line, Rect } from 'react-konva'
import { IGenericLayerProps } from '../../@types/components'
import { STYLE_CELL_BORDER } from '../../constants/styles'

const GridLayer: FunctionComponent<Partial<IGenericLayerProps>> = ({
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  columnStartBound,
  rowStartBound,
}) => {
  const Rows = useMemo(() => {
    const RowList: JSX.Element[] = []
    const x1 = columnOffsets[columnStartBound]
    const x2 =
      columnOffsets[columnEnd] -
      columnOffsets[columnStart] +
      columnOffsets[columnStartBound]

    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
      const y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      RowList.push(
        <Line
          key={`sheet-columns-${rowIndex}`}
          points={[x1, y, x2, y]}
          stroke={STYLE_CELL_BORDER}
          strokeWidth={1}
          transformsEnabled="position"
        />
      )
    }

    return RowList
  }, [
    columnOffsets,
    columnStartBound,
    columnStart,
    columnEnd,
    rowOffsets,
    rowStart,
    rowStartBound,
  ])

  const Columns = useMemo(() => {
    const ColumnList: JSX.Element[] = []
    const y1 = rowOffsets[rowStartBound]
    const y2 =
      rowOffsets[rowEnd] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

    for (
      let columnIndex = columnStart;
      columnIndex <= columnEnd;
      columnIndex += 1
    ) {
      const x =
        columnOffsets[columnIndex] -
        columnOffsets[columnStart] +
        columnOffsets[columnStartBound]
      ColumnList.push(
        <Line
          key={`sheet-columns-${columnIndex}`}
          points={[x, y1, x, y2]}
          stroke={STYLE_CELL_BORDER}
          strokeWidth={1}
          transformsEnabled="position"
        />
      )
    }

    return ColumnList
  }, [
    rowOffsets,
    rowStartBound,
    rowStart,
    rowEnd,
    columnOffsets,
    columnStart,
    columnStartBound,
  ])

  return (
    <Group listening={false}>
      <Rect
        x={columnOffsets[columnStart]}
        y={rowOffsets[rowStart]}
        width={columnOffsets[columnEnd] - columnOffsets[columnStart]}
        height={rowOffsets[rowEnd] - rowOffsets[rowStart]}
        fill="white"
      />
      {Rows}
      {Columns}
    </Group>
  )
}

export default GridLayer
