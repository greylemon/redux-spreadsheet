import React, { useEffect, useRef } from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../redux/store'
import Cell from './Cell'
import {
  selectData,
  selectGetRowHeight,
  selectGetColumnWidth,
  selectColumnWidthsAdjusted,
  selectTableRowCount,
  selectTableColumnCount,
  selectTableFreezeRowCount,
  selectTableFreezeColumnCount,
} from '../../redux/ExcelStore/selectors'
import BottomRightPane from './BottomRightPane'
import { shallowEqual } from 'react-redux'
import TopLeftPane from './TopLeftPane'
import TopRightPane from './TopRightPane'
import BottomLeftPane from './BottomLeftPane'

export const Sheet = ({ height, width }: Size) => {
  const gridRef = useRef<VariableSizeGrid>(null)
  const {
    tableColumnCount,
    tableRowCount,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
    columnWidthsAdjusted,
  } = useTypedSelector(
    (state) => ({
      tableColumnCount: selectTableColumnCount(state),
      tableRowCount: selectTableRowCount(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectTableFreezeRowCount(state),
      tableFreezeColumnCount: selectTableFreezeColumnCount(state),
      columnWidthsAdjusted: selectColumnWidthsAdjusted(state),
    }),
    shallowEqual
  )

  const itemData = { data, columnWidthsAdjusted, getRowHeight }

  useEffect(() => {
    const current = gridRef.current

    if (current) current.resetAfterIndices({ columnIndex: 0, rowIndex: 0 })
  }, [getColumnWidth, getRowHeight])

  return (
    <div className="sheetGrid" tabIndex={-1}>
      <VariableSizeGrid
        ref={gridRef}
        columnCount={tableColumnCount}
        columnWidth={getColumnWidth}
        height={height}
        rowCount={tableRowCount}
        rowHeight={getRowHeight}
        width={width}
        itemData={itemData}
        freezeColumnCount={tableFreezeColumnCount}
        freezeRowCount={tableFreezeRowCount}
        extraTopLeftElement={<TopLeftPane key="top-left-pane" />}
        extraTopRightElement={<TopRightPane key="top-right-pane" />}
        extraBottomRightElement={<BottomRightPane key="bottom-right-pane" />}
        extraBottomLeftElement={<BottomLeftPane key="bottom-left-pane" />}
      >
        {Cell}
      </VariableSizeGrid>
    </div>
  )
}

const SheetSizer = ({ height, width }: Size) => (
  <Sheet height={height} width={width} />
)

const SheetContainer = () => (
  <div className="sheet">
    <AutoSizer children={SheetSizer} />
  </div>
)

export default SheetContainer
