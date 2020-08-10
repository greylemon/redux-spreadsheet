import React, { FunctionComponent, useMemo, useCallback } from 'react'
import { Group, Rect, Line } from 'react-konva'
import { useDispatch } from 'react-redux'
import { IGenericPaneProps } from '../../@types/components'
import { IBlockStyles, IPosition } from '../../@types/state'
import { checkIsPositionEqualOtherPosition } from '../../tools'
import { STYLE_CELL_BORDER } from '../../constants/styles'
import { getPositionFromCellId as getPositionAndTypeFromCellId } from '../../tools/konva'
import {
  THUNK_MOUSE_DOWN,
  THUNK_MOUSE_DOUBLE_CLICK,
  THUNK_MOUSE_ENTER,
} from '../../redux/thunks/mouse'
import { ICellTypes } from '../../@types/general'

const getBorderWidth = (widthStyle: string) => {
  let width: number
  switch (widthStyle) {
    case 'medium':
      width = 2
      break
    case 'thick':
      width = 4
      break
    case 'thin':
    default:
      width = 1
      break
  }

  return width
}
const ContentLayer: FunctionComponent<Partial<IGenericPaneProps>> = ({
  id,
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  columnStartBound,
  rowStartBound,
  getColumnWidth,
  getRowHeight,
  data,
  CellComponent,
  enableColumnHeader,
  enableRowHeader,
}) => {
  const dispatch = useDispatch()

  const handleDoubleClick = useCallback(
    (event) => {
      const { type } = getPositionAndTypeFromCellId(event.currentTarget)

      dispatch(THUNK_MOUSE_DOUBLE_CLICK(type))
    },
    [dispatch]
  )

  const handleMouseDown = useCallback(
    ({ evt, currentTarget }) => {
      const { ctrlKey, shiftKey, which } = evt

      const { type, position } = getPositionAndTypeFromCellId(currentTarget)

      switch (which) {
        case 1:
          dispatch(THUNK_MOUSE_DOWN(type, position, shiftKey, ctrlKey))
          break
        default:
          break
      }
    },
    [dispatch]
  )

  const handleMouseEnter = useCallback(
    ({ evt, currentTarget }) => {
      const {
        // ctrlKey,
        // shiftKey,
        which,
      } = evt

      switch (which) {
        case 1: {
          const { type, position } = getPositionAndTypeFromCellId(currentTarget)
          dispatch(THUNK_MOUSE_ENTER(type, position))
          break
        }
        default:
          break
      }
    },
    [dispatch]
  )

  const { Styles, Texts } = useMemo(() => {
    const { data: sheetData } = data
    const StyleComponents: JSX.Element[] = []
    const TextCompnents: JSX.Element[] = []

    for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex += 1) {
      let y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      let height = getRowHeight(rowIndex)

      const rowData = sheetData[rowIndex] ? sheetData[rowIndex] : {}

      for (
        let columnIndex = columnStart;
        columnIndex < columnEnd;
        columnIndex += 1
      ) {
        let cellData = rowData[columnIndex] ? rowData[columnIndex] : {}

        let relativeRowIndex = rowIndex
        let relativeColumnIndex = columnIndex

        let width = getColumnWidth(columnIndex)
        let x =
          columnOffsets[relativeColumnIndex] -
          columnOffsets[columnStart] +
          columnOffsets[columnStartBound]

        let backgroundColor = 'transparent'
        if (cellData && cellData.merged) {
          let { area, parent } = cellData.merged

          if (area) {
            parent = { x: relativeColumnIndex, y: relativeRowIndex }
          } else {
            area = sheetData[parent.y][parent.x].merged.area
          }

          relativeColumnIndex = parent.x
          relativeRowIndex = parent.y

          const currentPosition: IPosition = { x: columnIndex, y: rowIndex }
          const adjustedPosition = {
            x: Math.max(columnStart, parent.x),
            y: Math.max(rowStart, parent.y),
          }

          if (
            !checkIsPositionEqualOtherPosition(parent, currentPosition) &&
            !checkIsPositionEqualOtherPosition(
              currentPosition,
              adjustedPosition
            )
          ) {
            columnIndex = area.end.x
            continue
          }

          cellData = sheetData[parent.y][parent.x]

          x =
            columnOffsets[parent.x] -
            columnOffsets[columnStart] +
            columnOffsets[columnStartBound]

          y =
            rowOffsets[parent.y] -
            rowOffsets[rowStart] +
            rowOffsets[rowStartBound]

          width = Math.min(
            columnOffsets[area.end.x + 1] - columnOffsets[area.start.x],
            columnOffsets[columnEnd] - columnOffsets[columnStart]
          )
          height = Math.min(
            rowOffsets[area.end.y + 1] - rowOffsets[area.start.y],
            rowOffsets[rowEnd] - rowOffsets[rowStart]
          )

          backgroundColor = 'white'
        }

        let type: ICellTypes

        if (rowIndex && columnIndex) {
          type = 'cell'
        } else if (rowIndex) {
          type = 'row'
        } else if (columnIndex) {
          type = 'column'
        } else {
          type = 'root'
        }

        const cellId = `${type}={"y":${relativeRowIndex},"x":${relativeColumnIndex}}`
        const keyId = `${id}-${cellId}`

        if (
          cellData &&
          cellData.style &&
          cellData.style.block &&
          cellData.style.block.backgroundColor
        )
          backgroundColor = cellData.style.block.backgroundColor

        StyleComponents.push(
          <Rect
            key={`bg-${keyId}`}
            id={cellId}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={backgroundColor}
            transformsEnabled="position"
            // perfectDrawEnabled={false}
            stroke={STYLE_CELL_BORDER}
            strokeWidth={1}
            // hitStrokeWidth={0}
            // shadowForStrokeEnabled={false}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            onDblClick={handleDoubleClick}
          />
        )

        if (cellData) {
          const {
            borderBottomColor,
            borderBottomStyle,
            borderBottomWidth,
            borderLeftColor,
            borderLeftStyle,
            borderLeftWidth,
            borderRightColor,
            borderRightStyle,
            borderRightWidth,
            borderTopColor,
            borderTopStyle,
            borderTopWidth,
          }: Partial<IBlockStyles> =
            cellData.style && cellData.style.block ? cellData.style.block : {}

          // ! CREATE A COMMON FUNCTION/STRUCTURE
          if (borderBottomColor || borderBottomStyle || borderBottomWidth) {
            StyleComponents.push(
              <Line
                key={`bb-${keyId}`}
                points={[x, y + height, x + width, y + height]}
                stroke={borderBottomColor}
                strokeWidth={getBorderWidth(borderBottomWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
              />
            )
          }

          if (borderLeftColor || borderLeftStyle || borderLeftWidth) {
            StyleComponents.push(
              <Line
                key={`bl-${keyId}`}
                points={[x, y, x, y + height]}
                stroke={borderLeftColor}
                strokeWidth={getBorderWidth(borderLeftWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
              />
            )
          }

          if (borderRightColor || borderRightStyle || borderRightWidth) {
            StyleComponents.push(
              <Line
                key={`br-${keyId}`}
                points={[x + width, y, x + width, y + height]}
                stroke={borderRightColor}
                strokeWidth={getBorderWidth(borderRightWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
              />
            )
          }

          if (borderTopColor || borderTopStyle || borderTopWidth) {
            StyleComponents.push(
              <Line
                key={`bt-${keyId}`}
                points={[x, y, x + width, y]}
                stroke={borderTopColor}
                strokeWidth={getBorderWidth(borderTopWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
              />
            )
          }
        }

        if (
          (sheetData[rowIndex] && sheetData[rowIndex][columnIndex]) ||
          (enableRowHeader && columnIndex === 0) ||
          (enableColumnHeader && rowIndex === 0)
        ) {
          TextCompnents.push(
            <CellComponent
              key={`text-${keyId}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              x={x}
              y={y}
              width={width}
              height={height}
              data={data}
            />
          )
        }
      }
    }

    return { Styles: StyleComponents, Texts: TextCompnents }
  }, [
    id,
    data,
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
    rowOffsets,
    columnOffsets,
    columnStartBound,
    rowStartBound,
    handleMouseEnter,
    handleMouseDown,
    handleDoubleClick,
  ])

  return (
    <Group>
      <Rect
        y={rowOffsets[rowStart]}
        x={columnOffsets[columnStart]}
        height={rowOffsets[rowEnd] - rowOffsets[rowStart]}
        width={columnOffsets[columnEnd] - columnOffsets[columnStart]}
        fill="white"
      />
      <Group>{Styles}</Group>
      <Group listening={false}>{Texts}</Group>
    </Group>
  )
}

export default ContentLayer
