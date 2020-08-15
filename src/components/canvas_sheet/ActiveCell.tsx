import React, { FunctionComponent, useMemo } from 'react'
import { Rect } from 'react-konva'
import { shallowEqual } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'
import { selectPosition } from '../../redux/selectors/custom'
import { IActiveCellPane } from '../../@types/components'
import { STYLE_ACTIVE_CELL_COLOR } from '../../constants/styles'

const ActiveCell: FunctionComponent<IActiveCellPane> = ({
  selectIsInPane,
  columnOffsets,
  rowOffsets,
  data,
  columnEnd,
  columnStart,
  rowEnd,
  rowStart,
  columnStartBound,
  rowStartBound,
  getColumnWidth,
  getRowHeight,
}) => {
  const { isInPane, activeCellPosition } = useTypedSelector(
    (state) => ({
      isInPane: selectIsInPane(state),
      activeCellPosition: selectPosition(state),
    }),
    shallowEqual
  )

  const style = useMemo(() => {
    if (
      !isInPane ||
      columnStart > activeCellPosition.x ||
      rowStart > activeCellPosition.y
    )
      return null

    let x =
      columnOffsets[activeCellPosition.x] -
      columnOffsets[columnStart] +
      columnOffsets[columnStartBound]

    let y =
      rowOffsets[activeCellPosition.y] -
      rowOffsets[rowStart] +
      rowOffsets[rowStartBound]

    let width = getColumnWidth(activeCellPosition.x)
    let height = getRowHeight(activeCellPosition.y)

    if (
      data[activeCellPosition.y] &&
      data[activeCellPosition.y][activeCellPosition.x] &&
      data[activeCellPosition.y][activeCellPosition.x].merged
    ) {
      let relativeRowIndex = activeCellPosition.y
      let relativeColumnIndex = activeCellPosition.x
      let { area, parent } = data[activeCellPosition.y][
        activeCellPosition.x
      ].merged

      if (area) {
        parent = { x: relativeColumnIndex, y: relativeRowIndex }
      } else {
        area = data[parent.y][parent.x].merged.area
      }

      relativeColumnIndex = parent.x
      relativeRowIndex = parent.y

      x =
        columnOffsets[parent.x] -
        columnOffsets[columnStart] +
        columnOffsets[columnStartBound]

      y =
        rowOffsets[parent.y] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      width = Math.min(
        columnOffsets[area.end.x + 1] - columnOffsets[area.start.x],
        columnOffsets[columnEnd] - columnOffsets[columnStart]
      )
      height = Math.min(
        rowOffsets[area.end.y + 1] - rowOffsets[area.start.y],
        rowOffsets[rowEnd] - rowOffsets[rowStart]
      )
    }

    return (
      <Rect
        x={x + 0.5}
        y={y + 0.5}
        height={height - 1.5}
        width={width - 1.5}
        stroke={STYLE_ACTIVE_CELL_COLOR}
        strokeWidth={2}
        listening={false}
      />
    )
  }, [
    isInPane,
    data,
    activeCellPosition,
    getColumnWidth,
    columnOffsets,
    rowOffsets,
    getRowHeight,
    rowStart,
    rowStartBound,
    rowEnd,
    columnStart,
    columnStartBound,
    columnEnd,
  ])

  return style
}

export default ActiveCell
