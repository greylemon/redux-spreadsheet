import React, { FunctionComponent, useMemo } from 'react'
import { Rect } from 'react-konva'
import { shallowEqual } from 'react-redux'
import { ISelectionAreaPane } from '../../@types/components'
import { useTypedSelector } from '../../redux/redux'
import { selectSelectionArea } from '../../redux/selectors/base'
import { STYLE_SELECTION_AREA } from '../../constants/styles'
import { getOrderedAreaFromArea } from '../../tools'

const SelectionArea: FunctionComponent<ISelectionAreaPane> = ({
  columnEnd,
  columnStart,
  columnStartBound,
  rowEnd,
  rowStart,
  rowStartBound,
  columnOffsets,
  rowOffsets,
  selectIsAreaInPane,
}) => {
  const { selectionArea, isAreaInPane } = useTypedSelector(
    (state) => ({
      isAreaInPane: selectIsAreaInPane(state),
      selectionArea: selectSelectionArea(state),
    }),
    shallowEqual
  )

  return useMemo(() => {
    if (isAreaInPane) {
      const orderedArea = getOrderedAreaFromArea(selectionArea)

      orderedArea.start.x = Math.max(columnStart, orderedArea.start.x)
      orderedArea.start.y = Math.max(rowStart, orderedArea.start.y)

      const x =
        columnOffsets[orderedArea.start.x] -
        columnOffsets[columnStart] +
        columnOffsets[columnStartBound]

      const y =
        rowOffsets[orderedArea.start.y] -
        rowOffsets[rowStart] +
        rowOffsets[rowStartBound]

      const width = Math.min(
        columnOffsets[columnEnd] - x,
        columnOffsets[orderedArea.end.x + 1] -
          columnOffsets[orderedArea.start.x]
      )

      const height = Math.min(
        rowOffsets[rowEnd] - y,
        rowOffsets[orderedArea.end.y + 1] - rowOffsets[orderedArea.start.y]
      )

      return (
        width > 0 &&
        height > 0 && (
          <Rect
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
    }

    return null
  }, [
    isAreaInPane,
    selectionArea,
    columnEnd,
    columnStart,
    columnStartBound,
    rowEnd,
    rowStart,
    rowStartBound,
    columnOffsets,
    rowOffsets,
  ])
}

export default SelectionArea
