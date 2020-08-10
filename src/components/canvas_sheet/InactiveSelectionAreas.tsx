import React, { FunctionComponent, useMemo } from 'react'
import { Rect } from 'react-konva'
import { shallowEqual } from 'react-redux'
import { ISelectionAreaPane } from '../../@types/components'
import { useTypedSelector } from '../../redux/redux'
import { selectInactiveSelectionAreas } from '../../redux/selectors/base'
import { STYLE_SELECTION_AREA } from '../../constants/styles'
import { getAreaStyleDimension } from '../../tools/area'

const InactiveSelectionAreas: FunctionComponent<Partial<
  ISelectionAreaPane
>> = ({
  columnEnd,
  columnStart,
  columnStartBound,
  rowEnd,
  rowStart,
  rowStartBound,
  columnOffsets,
  rowOffsets,
}) => {
  const inactiveSelectionAreas = useTypedSelector(
    (state) => selectInactiveSelectionAreas(state),
    shallowEqual
  )

  return useMemo(
    () => (
      <>
        {inactiveSelectionAreas.map((selectionArea) => {
          // ! Check if in pane!!
          const { width, height, x, y } = getAreaStyleDimension(
            selectionArea,
            columnStart,
            rowStart,
            columnOffsets,
            columnStartBound,
            rowOffsets,
            rowStartBound,
            columnEnd,
            rowEnd
          )

          return (
            width > 0 &&
            height > 0 && (
              <Rect
                key={`inactive-${x}${y}${width}${height}`}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={STYLE_SELECTION_AREA}
                opacity={0.1}
                listening={false}
              />
            )
          )
        })}
      </>
    ),
    [
      inactiveSelectionAreas,
      columnEnd,
      columnStart,
      columnStartBound,
      rowEnd,
      rowStart,
      rowStartBound,
      columnOffsets,
      rowOffsets,
    ]
  )
}

export default InactiveSelectionAreas
