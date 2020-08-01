import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { IRowOffsets, IColumnOffsets } from '../../@types/state'
import { IGetRowHeight, IGetColumnWidth } from '../../@types/functions'
import { Columns } from './Columns'

export const Rows: FunctionComponent<{
  tableRowCount: number
  tableColumnCount: number
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
}> = ({
  tableRowCount,
  tableColumnCount,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,
}) => {
  const RowComponents = useMemo(() => {
    const RowList: JSX.Element[] = []
    for (let rowIndex = 0; rowIndex <= tableRowCount; rowIndex += 1) {
      RowList.push(
        <Columns
          key={`sheet-row-${rowIndex}`}
          tableColumnCount={tableColumnCount}
          rowOffsets={rowOffsets}
          columnOffsets={columnOffsets}
          rowIndex={rowIndex}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
        />
      )
    }

    return RowList
  }, [tableRowCount])

  return <Group>{RowComponents}</Group>
}
