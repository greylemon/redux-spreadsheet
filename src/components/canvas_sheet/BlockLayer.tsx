import React, { FunctionComponent, useMemo } from 'react'
import { Group, Rect, Line } from 'react-konva'
import { IGenericLayerProps } from '../../@types/components'
import { IBlockStyles } from '../../@types/state'

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

const BlockLayer: FunctionComponent<Partial<IGenericLayerProps>> = ({
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
}) => {
  const Rows = useMemo(() => {
    const { data: sheetData } = data
    const RowList: JSX.Element[] = []
    const visitedDataCells: { [key: string]: Set<number> } = {}

    for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex += 1) {
      const ColumnList: JSX.Element[] = []
      let y =
        rowOffsets[rowIndex] - rowOffsets[rowStart] + rowOffsets[rowStartBound]

      let height = getRowHeight(rowIndex)

      const rowData = sheetData[rowIndex]

      if (rowData) {
        for (
          let columnIndex = columnStart;
          columnIndex < columnEnd;
          columnIndex += 1
        ) {
          const cellData = rowData[columnIndex]

          if (cellData) {
            let relativeRowIndex = rowIndex
            let relativeColumnIndex = columnIndex

            let width = getColumnWidth(columnIndex)
            let x =
              columnOffsets[relativeColumnIndex] -
              columnOffsets[columnStart] +
              columnOffsets[columnStartBound]

            if (cellData.merged) {
              let { area, parent } = cellData.merged

              if (area) {
                parent = { x: relativeColumnIndex, y: relativeRowIndex }
              } else {
                area = sheetData[parent.y][parent.x].merged.area
              }

              x =
                columnOffsets[parent.x] -
                columnOffsets[columnStart] +
                columnOffsets[columnStartBound]

              y =
                rowOffsets[parent.y] -
                rowOffsets[rowStart] +
                rowOffsets[rowStartBound]

              // TODO : FIND MIN
              width = Math.min(
                columnOffsets[area.end.x + 1] - columnOffsets[area.start.x],
                columnOffsets[columnEnd] - columnOffsets[columnStart]
              )
              height = Math.min(
                rowOffsets[area.end.y + 1] - rowOffsets[area.start.y],
                rowOffsets[rowEnd] - rowOffsets[rowStart]
              )

              relativeColumnIndex = parent.x
              relativeRowIndex = parent.y
            }

            if (
              !visitedDataCells[relativeRowIndex] ||
              !visitedDataCells[relativeRowIndex].has(relativeColumnIndex)
            ) {
              if (!visitedDataCells[relativeRowIndex])
                visitedDataCells[relativeRowIndex] = new Set()
              visitedDataCells[relativeRowIndex].add(relativeColumnIndex)

              const {
                backgroundColor,
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
                cellData.style && cellData.style.block
                  ? cellData.style.block
                  : {}
              // console.log(borderLeftStyle)

              if (backgroundColor || cellData.merged) {
                ColumnList.push(
                  <Rect
                    key={`${id}-background-color-${relativeRowIndex}-${relativeColumnIndex}`}
                    x={x + 1}
                    y={y + 1}
                    width={width - 1}
                    height={height - 1}
                    fill={backgroundColor || 'white'}
                    transformsEnabled="position"
                  />
                )
              }

              // ! CREATE A COMMON FUNCTION/STRUCTURE
              if (borderBottomColor || borderBottomStyle || borderBottomWidth) {
                ColumnList.push(
                  <Line
                    key={`${id}-border-bottom-${relativeRowIndex}-${relativeColumnIndex}`}
                    points={[x, y + height, x + width, y + height]}
                    stroke={borderBottomColor}
                    strokeWidth={getBorderWidth(borderBottomWidth)}
                  />
                )
              }

              if (borderLeftColor || borderLeftStyle || borderLeftWidth) {
                ColumnList.push(
                  <Line
                    key={`${id}-border-left-${relativeRowIndex}-${relativeColumnIndex}`}
                    points={[x, y, x, y + height]}
                    stroke={borderLeftColor}
                    strokeWidth={getBorderWidth(borderLeftWidth)}
                  />
                )
              }

              if (borderRightColor || borderRightStyle || borderRightWidth) {
                ColumnList.push(
                  <Line
                    key={`${id}-border-right-${relativeRowIndex}-${relativeColumnIndex}`}
                    points={[x + width, y, x + width, y + height]}
                    stroke={borderRightColor}
                    strokeWidth={getBorderWidth(borderRightWidth)}
                  />
                )
              }

              if (borderTopColor || borderTopStyle || borderTopWidth) {
                ColumnList.push(
                  <Line
                    key={`${id}-border-top-${relativeRowIndex}-${relativeColumnIndex}`}
                    points={[x, y, x + width, y]}
                    stroke={borderTopColor}
                    strokeWidth={getBorderWidth(borderTopWidth)}
                  />
                )
              }
            }
          }
        }
      }

      RowList.push(
        <Group key={`${id}-style-rows-${rowIndex}`}>{ColumnList}</Group>
      )
    }

    return RowList
  }, [
    id,
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
    rowOffsets,
    columnOffsets,
    columnStartBound,
    rowStartBound,
    data,
  ])

  return <Group>{Rows}</Group>
}

export default BlockLayer
