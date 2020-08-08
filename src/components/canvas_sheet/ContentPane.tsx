import React, { FunctionComponent, useMemo } from 'react'
import { Group, Rect, Line } from 'react-konva'
import { IGenergicPaneProps } from '../../@types/components'
import { IBlockStyles, IPosition } from '../../@types/state'
import { checkIsPositionEqualOtherPosition } from '../../tools'
import { STYLE_CELL_BORDER } from '../../constants/styles'

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
const ContentLayer: FunctionComponent<Partial<IGenergicPaneProps>> = ({
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
  const { Styles, Texts } = useMemo(() => {
    const { data: sheetData } = data
    const StyleComponents: JSX.Element[] = []
    const TextCompnents: JSX.Element[] = []
    const topLeftPosition: IPosition = { x: columnStart, y: rowStart }

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
        const cellData = rowData[columnIndex] ? rowData[columnIndex] : {}

        let relativeRowIndex = rowIndex
        let relativeColumnIndex = columnIndex

        let width = getColumnWidth(columnIndex)
        let x =
          columnOffsets[relativeColumnIndex] -
          columnOffsets[columnStart] +
          columnOffsets[columnStartBound]

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

          if (
            !checkIsPositionEqualOtherPosition(parent, currentPosition) &&
            !checkIsPositionEqualOtherPosition(currentPosition, topLeftPosition)
          ) {
            columnIndex = area.end.x
            continue
          }

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
        }

        const cellId = `cell={"y":${rowIndex},"x":${columnIndex}}`
        // const keyId = `${id}-${cellId}`

        let backgroundColor = 'transparent'
        if (
          cellData &&
          cellData.style &&
          cellData.style.block &&
          cellData.style.block.backgroundColor
        )
          backgroundColor = cellData.style.block.backgroundColor

        StyleComponents.push(
          <Rect
            // key={`bg-${keyId}`}
            id={cellId}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={backgroundColor}
            transformsEnabled="position"
            perfectDrawEnabled={false}
            stroke={STYLE_CELL_BORDER}
            strokeWidth={1}
            hitStrokeWidth={0}
            shadowForStrokeEnabled={false}
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
                // key={`bb-${keyId}`}
                points={[x, y + height, x + width, y + height]}
                stroke={borderBottomColor}
                strokeWidth={getBorderWidth(borderBottomWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
                listening={false}
              />
            )
          }

          if (borderLeftColor || borderLeftStyle || borderLeftWidth) {
            StyleComponents.push(
              <Line
                // key={`bl-${keyId}`}
                points={[x, y, x, y + height]}
                stroke={borderLeftColor}
                strokeWidth={getBorderWidth(borderLeftWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
                listening={false}
              />
            )
          }

          if (borderRightColor || borderRightStyle || borderRightWidth) {
            StyleComponents.push(
              <Line
                // key={`br-${keyId}`}
                points={[x + width, y, x + width, y + height]}
                stroke={borderRightColor}
                strokeWidth={getBorderWidth(borderRightWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
                listening={false}
              />
            )
          }

          if (borderTopColor || borderTopStyle || borderTopWidth) {
            StyleComponents.push(
              <Line
                // key={`bt-${keyId}`}
                points={[x, y, x + width, y]}
                stroke={borderTopColor}
                strokeWidth={getBorderWidth(borderTopWidth)}
                transformsEnabled="position"
                perfectDrawEnabled={false}
                hitStrokeWidth={0}
                listening={false}
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
              // key={`text-${keyId}`}
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
  ])

  return (
    <Group>
      <Group>{Styles}</Group>
      <Group listening={false}>{Texts}</Group>
    </Group>
  )
}

export default ContentLayer
