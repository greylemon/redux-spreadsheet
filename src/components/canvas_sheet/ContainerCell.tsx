import React, { FunctionComponent } from 'react'
import { Group, Rect, Text } from 'react-konva'
import { IRowOffsets, IColumnOffsets } from '../../@types/state'
import { IGetRowHeight, IGetColumnWidth } from '../../@types/functions'

export const Cell: FunctionComponent<{
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  columnIndex: number
  rowIndex: number
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
}> = ({
  rowOffsets,
  columnOffsets,
  columnIndex,
  rowIndex,
  getColumnWidth,
  getRowHeight,
}) => {
  return (
    <Group>
      <Rect
        x={columnOffsets[columnIndex]}
        y={rowOffsets[rowIndex]}
        width={getColumnWidth(columnIndex)}
        height={getRowHeight(rowIndex)}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        text={`${rowIndex}, ${columnIndex}`}
        fontSize={15}
        x={columnOffsets[columnIndex]}
        y={rowOffsets[rowIndex]}
      />
    </Group>
  )
}
