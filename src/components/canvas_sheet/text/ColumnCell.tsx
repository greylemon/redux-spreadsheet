import React, { FunctionComponent } from 'react'

import { Group, Text, Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_HEADER_FILL, STYLE_CELL_BORDER } from '../../../constants/styles'
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
      height={height - 1}
      stroke={STYLE_CELL_BORDER}
      strokeWidth={1}
      transformsEnabled="position"
      hitStrokeWidth={0}
      listeneing={false}
    />
    <Rect
      x={x}
      y={y}
      width={width}
      height={height - 1}
      fill={STYLE_HEADER_FILL}
      transformsEnabled="position"
      hitStrokeWidth={0}
      listeneing={false}
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
      hitStrokeWidth={0}
    />
  </Group>
)

export default ColumnCell
