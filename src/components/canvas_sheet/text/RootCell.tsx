import React, { FunctionComponent } from 'react'
import { Rect } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { STYLE_CELL_BORDER, STYLE_HEADER_FILL } from '../../../constants/styles'

const RootCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
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
  )
}

export default RootCell
