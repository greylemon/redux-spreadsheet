import React, { FunctionComponent } from 'react'

import { Group, Text, Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_CELL_BORDER, STYLE_HEADER_FILL } from '../../../constants/styles'
import { columnNumberToName } from '../../../tools/conversion'

const ColumnCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
  columnIndex,
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
    />
    <Text
      id={`column={"x":${columnIndex}}`}
      text={columnNumberToName(columnIndex)}
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

export default ColumnCell
