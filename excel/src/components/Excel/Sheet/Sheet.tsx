import React from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

type CellProps = {
  columnIndex: number
  rowIndex: number
  style: object
}

const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50))
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50))

const Cell = ({ columnIndex, rowIndex, style }: CellProps) => (
  <div style={style}>
    Item {rowIndex},{columnIndex}
  </div>
)

export const Sheet = () => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeGrid
          columnCount={26}
          columnWidth={(index) => columnWidths[index]}
          height={height}
          rowCount={1000}
          rowHeight={(index) => rowHeights[index]}
          width={width}
          extraBottomRightElement={<div />}
        >
          {Cell}
        </VariableSizeGrid>
      )}
    </AutoSizer>
  )
}

export default Sheet
