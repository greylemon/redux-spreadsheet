import React, { FunctionComponent } from 'react'
import { Group } from 'react-konva'
import { IGenergicPaneProps } from '../../@types/components'
import GridLayer from './grid_layer/GridLayer'
import TextLayer from './text_layer/TextLayer'

const GenericPane: FunctionComponent<IGenergicPaneProps> = ({
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,
  topLeftPositionX,
  topLeftPositionY,
  tableFreezeRowCount,
  tableFreezeColumnCount,
  CellComponent,
  data,
}) => (
  <Group>
    <GridLayer
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      topLeftPositionX={topLeftPositionX}
      topLeftPositionY={topLeftPositionY}
      tableFreezeRowCount={tableFreezeRowCount}
      tableFreezeColumnCount={tableFreezeColumnCount}
    />
    <TextLayer
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      CellComponent={CellComponent}
      data={data}
      topLeftPositionX={topLeftPositionX}
      topLeftPositionY={topLeftPositionY}
      tableFreezeRowCount={tableFreezeRowCount}
      tableFreezeColumnCount={tableFreezeColumnCount}
    />
  </Group>
)

export default GenericPane
