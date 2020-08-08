import React, { FunctionComponent } from 'react'

import { Group, Text, Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_CELL_BORDER, STYLE_HEADER_FILL } from '../../../constants/styles'

const RowCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
  rowIndex,
}) => (
  <Group>
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={STYLE_CELL_BORDER}
      strokeWidth={1}
      fill={STYLE_HEADER_FILL}
      transformsEnabled="position"
      perfectDrawEnabled={false}
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
    />
    <Text
      id={`row={"y":${rowIndex}}`}
      text={rowIndex.toString()}
      x={x}
      y={y}
      width={width}
      height={height}
      align="center"
      verticalAlign="middle"
      transformsEnabled="position"
      perfectDrawEnabled={false}
      hitStrokeWidth={0}
    />
  </Group>
)

export default RowCell
