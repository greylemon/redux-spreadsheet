import React, { useEffect, useRef } from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../../redux/store'
import Cell from './Cell'
import {
  selectColumnCount,
  selectRowCount,
  selectData,
  selectFreezeRowCount,
  selectFreezeColumnCount,
  selectGetRowHeight,
  selectGetColumnWidth,
  selectColumnWidthsAdjusted,
} from '../../../redux/ExcelStore/selectors'
import BottomRightPane from './BottomRightPane'
import { shallowEqual } from 'react-redux'

export const Sheet = ({ height, width }: Size) => {
  const gridRef = useRef<VariableSizeGrid>(null)
  const {
    columnCount,
    rowCount,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
    columnWidthsAdjusted,
  } = useTypedSelector(
    (state) => ({
      columnCount: selectColumnCount(state),
      rowCount: selectRowCount(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectFreezeRowCount(state) + 1,
      tableFreezeColumnCount: selectFreezeColumnCount(state) + 1,
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
        columnCount={columnCount}
        columnWidth={getColumnWidth}
        height={height}
        rowCount={rowCount}
        rowHeight={getRowHeight}
        width={width}
        itemData={itemData}
        freezeColumnCount={tableFreezeColumnCount}
        freezeRowCount={tableFreezeRowCount}
        extraBottomRightElement={
          <BottomRightPane key="bottom-right-activity-pane" />
        }
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
