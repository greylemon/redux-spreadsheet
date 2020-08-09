import React, { FunctionComponent, useMemo } from 'react'
import { Rect } from 'react-konva'
import { shallowEqual } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'
import { selectPosition } from '../../redux/selectors/custom'
import { IActiveCellPane } from '../../@types/components'

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
    if (!isInPane) return null

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

    return {
      x,
      y,
      width,
      height,
    }
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

  return isInPane ? (
    <Rect
      id={`cell={"x":${activeCellPosition.x},"y":${activeCellPosition.y}}`}
      x={style.x}
      y={style.y}
      height={style.height}
      width={style.width}
      stroke="black"
      strokeWidth={1}
    />
  ) : null
}

export default ActiveCell
