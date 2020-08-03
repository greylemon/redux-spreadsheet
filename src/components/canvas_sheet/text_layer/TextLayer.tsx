import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { ITextLayerProps } from '../../../@types/components'
import { getActualDimensionOffset } from '../../../tools/area'

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
  topLeftPositionX,
  topLeftPositionY,
  tableFreezeRowCount,
  tableFreezeColumnCount,
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
        const x = getActualDimensionOffset(
          columnOffsets,
          columnIndex,
          topLeftPositionX,
          tableFreezeColumnCount
        )
        const y = getActualDimensionOffset(
          rowOffsets,
          rowIndex,
          topLeftPositionY,
          tableFreezeRowCount
        )

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
    topLeftPositionX,
    topLeftPositionY,
    tableFreezeRowCount,
    tableFreezeColumnCount,
  ])
  return <Group>{Rows}</Group>
}

export default TextLayer
