import React, { FunctionComponent, useMemo } from 'react'
import { Group, Rect } from 'react-konva'
import { IGenericLayerProps } from '../../../@types/components'
import { STYLE_CELL_BORDER } from '../../../constants/styles'
import { getActualDimensionOffset } from '../../../tools/area'

const GridLayer: FunctionComponent<Partial<IGenericLayerProps>> = ({
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
          <Rect
            key={`sheet-columns-${columnIndex}`}
            x={x}
            y={y}
            width={getColumnWidth(columnIndex)}
            height={getRowHeight(rowIndex)}
            stroke={STYLE_CELL_BORDER}
            strokeWidth={1}
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

export default GridLayer
