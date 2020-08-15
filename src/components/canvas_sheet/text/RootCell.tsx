import React, { FunctionComponent } from 'react'
import { Rect, Group } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_HEADER_FILL, STYLE_CELL_BORDER } from '../../../constants/styles'

const RootCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width - 1}
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
        width={width - 1}
        height={height - 1}
        fill={STYLE_HEADER_FILL}
        transformsEnabled="position"
        hitStrokeWidth={0}
        listeneing={false}
      />
    </Group>
  )
}

export default RootCell
