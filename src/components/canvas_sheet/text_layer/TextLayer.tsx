import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { ITextLayerProps } from '../../../@types/components'

const TextLayer: FunctionComponent<ITextLayerProps> = ({
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
}) => {
  const Rows = useMemo(() => {
    const sheetData = data.data
    const RowList: JSX.Element[] = []
    for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex += 1) {
      const row = sheetData[rowIndex]

      const ColumnList: JSX.Element[] = []

      const y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      for (
        let columnIndex = columnStart;
        columnIndex < columnEnd;
        columnIndex += 1
      ) {
        if (rowIndex === 0 || columnIndex === 0 || (row && row[columnIndex])) {
          const x =
            columnOffsets[columnIndex] -
            columnOffsets[columnStart] +
            columnOffsets[columnStartBound]

          ColumnList.push(
            <CellComponent
              key={`sheet-columns-${columnIndex}`}
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

      RowList.push(
        <Group key={`sheet-top-left-row-${rowIndex}`}>{ColumnList}</Group>
      )
    }

    return RowList
  }, [
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
  ])
  return <Group listening={false}>{Rows}</Group>
}

export default TextLayer
