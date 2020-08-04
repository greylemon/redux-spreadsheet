import React, { FunctionComponent, useMemo } from 'react'
import { Group, Rect } from 'react-konva'
import { IGenericLayerProps } from '../../../@types/components'

const BlockLayer: FunctionComponent<Partial<IGenericLayerProps>> = ({
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
  data,
}) => {
  const Rows = useMemo(() => {
    const { data: sheetData } = data
    const RowList: JSX.Element[] = []
    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
      const ColumnList: JSX.Element[] = []
      const y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      const rowHeight = getRowHeight(rowIndex)

      const rowData = sheetData[rowIndex]

      if (rowData) {
        for (
          let columnIndex = columnStart;
          columnIndex <= columnEnd;
          columnIndex += 1
        ) {
          const cellData = rowData[columnIndex]

          if (cellData && cellData.style && cellData.style.block) {
            const x =
              columnOffsets[columnIndex] -
              columnOffsets[columnStart] +
              columnOffsets[columnStartBound]

            const { block } = cellData.style
            const { backgroundColor } = block

            // ! CONSIDER MERGE AND BORDER
            if (backgroundColor) {
              ColumnList.push(
                <Rect
                  key={`sheet-container-columns-${columnIndex}`}
                  x={x}
                  y={y}
                  width={getColumnWidth(columnIndex)}
                  height={rowHeight}
                  fill={backgroundColor}
                  transformsEnabled="position"
                />
              )
            }
          }
        }
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
    data,
  ])

  return <Group>{Rows}</Group>
}

export default BlockLayer
