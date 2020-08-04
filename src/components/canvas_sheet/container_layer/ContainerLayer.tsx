import React, { FunctionComponent, useMemo } from 'react'
import { Group, Rect } from 'react-konva'
import { IGenericLayerProps } from '../../../@types/components'

const ContainerLayer: FunctionComponent<Partial<IGenericLayerProps>> = ({
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  columnStartBound,
  rowStartBound,
  getColumnWidth,
  getRowHeight,
}) => {
  const Rows = useMemo(() => {
    const RowList: JSX.Element[] = []
    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
      const ColumnList: JSX.Element[] = []
      const y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      const rowHeight = getRowHeight(rowIndex)
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
          <Rect
            key={`sheet-container-columns-${columnIndex}`}
            id={`cell={"y":${rowIndex},"x":${columnIndex}}`}
            x={x}
            y={y}
            width={getColumnWidth(columnIndex)}
            height={rowHeight}
            transformsEnabled="position"
          />
        )
      }

      RowList.push(
        <Group key={`sheet-container-rows-${rowIndex}`}>{ColumnList}</Group>
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
    columnStartBound,
    rowStartBound,
  ])

  return <Group>{Rows}</Group>
}

export default ContainerLayer
