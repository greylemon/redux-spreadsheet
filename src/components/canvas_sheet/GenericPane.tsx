import React, { FunctionComponent } from 'react'
import { Group } from 'react-konva'
import { IGenergicPaneProps } from '../../@types/components'
import GridLayer from './GridLayer'
import TextLayer from './text_layer/TextLayer'
import ContainerLayer from './ContainerLayer'
import BlockLayer from './BlockLayer'

const GenericPane: FunctionComponent<IGenergicPaneProps> = ({
  id,
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,

  columnStartBound,
  rowStartBound,

  CellComponent,
  data,
  enableRowHeader,
  enableColumnHeader,
}) => (
  <Group>
    <GridLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
    />
    <BlockLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      data={data}
    />
    <TextLayer
      id={id}
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
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      enableRowHeader={enableRowHeader}
      enableColumnHeader={enableColumnHeader}
    />
    <ContainerLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
    />
  </Group>
)

export default GenericPane
