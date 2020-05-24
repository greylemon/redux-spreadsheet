import React from 'react'
import { VariableSizeGrid } from 'react-window'

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
    <VariableSizeGrid
      columnCount={1000}
      columnWidth={(index) => columnWidths[index]}
      height={150}
      rowCount={1000}
      rowHeight={(index) => rowHeights[index]}
      width={300}
      extraBottomRightElement={<div />}
    >
      {Cell}
    </VariableSizeGrid>
  )
}

export default Sheet
