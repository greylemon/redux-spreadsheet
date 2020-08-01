import React, { FunctionComponent, useMemo } from 'react'
import { Group } from 'react-konva'
import { IRowOffsets, IColumnOffsets } from '../../@types/state'
import { IGetRowHeight, IGetColumnWidth } from '../../@types/functions'
import { Cell } from './ContainerCell'

const TopLeftPane: FunctionComponent<{
  tableRowCount: number
  tableColumnCount: number
  rowOffsets: IRowOffsets
  columnOffsets: IColumnOffsets
  getRowHeight: IGetRowHeight
  getColumnWidth: IGetColumnWidth
  tableFreezeColumnCount: number
  tableFreezeRowCount: number
}> = ({
  tableFreezeColumnCount,
  tableFreezeRowCount,
  tableRowCount,
  tableColumnCount,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,
}) => {
  const TopLeftComponents = useMemo(() => {
    const RowList: JSX.Element[] = []
    for (let rowIndex = 0; rowIndex < tableFreezeRowCount; rowIndex += 1) {
      const ColumnList: JSX.Element[] = []
      for (
        let columnIndex = 0;
        columnIndex < tableFreezeColumnCount;
        columnIndex += 1
      ) {
        ColumnList.push(
          <Cell
            key={`sheet-columns-${columnIndex}`}
            rowOffsets={rowOffsets}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            columnOffsets={columnOffsets}
            getColumnWidth={getColumnWidth}
            getRowHeight={getRowHeight}
          />
        )
      }

      RowList.push(
        <Group
          key={`sheet-top-left-row-${rowIndex}`}
          clipX={0}
          clipY={0}
          clipWidth={50}
          clipHeight={50}
        >
          {ColumnList}
        </Group>
      )
    }

    return RowList
  }, [
    tableFreezeColumnCount,
    tableFreezeRowCount,
    rowOffsets,
    columnOffsets,
    getColumnWidth,
    getRowHeight,
  ])

  return (
    <Group
      height={rowOffsets[tableFreezeRowCount]}
      width={columnOffsets[tableFreezeColumnCount]}
    >
      {TopLeftComponents}
    </Group>
  )
}

export default TopLeftPane
