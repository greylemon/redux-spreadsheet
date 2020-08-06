import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { ITextLayerProps } from '../../../@types/components'

const TextLayer: FunctionComponent<ITextLayerProps> = ({
  id,
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,
  CellComponent,
  data,
  columnStartBound,
  rowStartBound,
  enableColumnHeader,
  enableRowHeader,
}) => {
  const Rows = useMemo(() => {
    const sheetData = data.data
    const RowList: JSX.Element[] = []
    for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex += 1) {
      const row = sheetData[rowIndex]

      const ColumnList: JSX.Element[] = []

      const y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      // TODO : Replace with a flag instead for row and column to optimize
      // ! FLAG: isRowHeaderPossible and isColumnHeaderPossible (for top left, bottom left, top right panes)
      if (
        row ||
        (enableRowHeader && rowIndex > 0) ||
        (enableColumnHeader && rowIndex === 0)
      ) {
        for (
          let columnIndex = columnStart;
          columnIndex < columnEnd;
          columnIndex += 1
        ) {
          if (
            (row && row[columnIndex]) ||
            (enableRowHeader && columnIndex === 0) ||
            (enableColumnHeader && columnIndex > 0)
          ) {
            const x =
              columnOffsets[columnIndex] -
              columnOffsets[columnStart] +
              columnOffsets[columnStartBound]

            ColumnList.push(
              <CellComponent
                key={`${id}-text-columns-${columnIndex}`}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                getColumnWidth={getColumnWidth}
                getRowHeight={getRowHeight}
                x={x}
                y={y}
                width={getColumnWidth(columnIndex)}
                height={getRowHeight(rowIndex)}
                data={data}
              />
            )
          }
        }
      }

      RowList.push(
        <Group key={`${id}-text-row-${rowIndex}`}>{ColumnList}</Group>
      )
    }

    return RowList
  }, [
    id,
    data,
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
    rowOffsets,
    columnOffsets,
    getColumnWidth,
    getRowHeight,
    columnStartBound,
    rowStartBound,
    enableColumnHeader,
    enableRowHeader,
  ])
  return <Group listening={false}>{Rows}</Group>
}

export default TextLayer
