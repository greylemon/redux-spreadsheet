import React, { FunctionComponent } from 'react'

import { Group, Text, Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_HEADER_FILL } from '../../../constants/styles'

const RowCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
  rowIndex,
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
      id={`row={"y":${rowIndex}}`}
      text={rowIndex.toString()}
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

export default RowCell
