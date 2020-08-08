import React, { memo, FunctionComponent } from 'react'

import { Group } from 'react-konva'
import { IGenergicPaneProps } from '../../@types/components'
import ContentLayer from './ContentPane'

const GenericPane: FunctionComponent<Partial<IGenergicPaneProps>> = memo(
  ({
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
    </Group>
  )
)

export default GenericPane
