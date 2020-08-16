import React, { FunctionComponent } from 'react'

import { Group, Text, Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_HEADER_FILL } from '../../../constants/styles'
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
      x={x + 0.5}
      y={y + 0.5}
      width={width - 1}
      height={height - 1}
      fill={STYLE_HEADER_FILL}
      transformsEnabled="position"
      hitStrokeWidth={0}
      listeneing={false}
    />
    <Text
      id={`column={"x":${columnIndex}}`}
      text={columnNumberToName(columnIndex)}
      x={x + 0.5}
      y={y + 0.5}
      width={width}
      height={height}
      align="center"
      verticalAlign="middle"
    />
  </Group>
)

export default ColumnCell
