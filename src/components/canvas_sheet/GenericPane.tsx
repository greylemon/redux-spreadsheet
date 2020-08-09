import React, { FunctionComponent } from 'react'

import { Group } from 'react-konva'
import { IGenericPaneProps } from '../../@types/components'
import ContentLayer from './ContentPane'
import ActiveCell from './ActiveCell'

const GenericPane: FunctionComponent<Partial<IGenericPaneProps>> = ({
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
  selectIsInPane,
}) => (
  <Group>
    <ContentLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      data={data}
      CellComponent={CellComponent}
      enableColumnHeader={enableColumnHeader}
      enableRowHeader={enableRowHeader}
    />
    <ActiveCell
      selectIsInPane={selectIsInPane}
      data={data.data}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
    />
  </Group>
)

export default GenericPane
