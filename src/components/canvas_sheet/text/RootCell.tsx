import React, { FunctionComponent } from 'react'
import { Rect, Group } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_HEADER_FILL } from '../../../constants/styles'

const RootCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
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
    </Group>
  )
}

export default RootCell
