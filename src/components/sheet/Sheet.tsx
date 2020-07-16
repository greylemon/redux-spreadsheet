import React, { useEffect, useRef, FunctionComponent, useCallback } from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../redux/redux'
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
  selectActiveResults,
} from '../../redux/selectors'
import CommonPane from './CommonPane'
import { shallowEqual, useDispatch } from 'react-redux'

import { ContextMenuTrigger } from 'react-contextmenu'
import CustomContextMenu from './CustomContextMenu'
import { ExcelActions } from '../../redux/store'

export const Sheet: FunctionComponent<Size> = ({ height, width }) => {
  const dispatch = useDispatch()
  const gridRef = useRef<VariableSizeGrid>(null)
  const {
    sheetResults,
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
      sheetResults: selectActiveResults(state),
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

  useEffect(() => {
    const current = gridRef.current

    if (current) current.resetAfterIndices({ columnIndex: 0, rowIndex: 0 })
  }, [getColumnWidth, getRowHeight])

  const handleDoubleClick = useCallback(() => {
    dispatch(ExcelActions.CELL_DOUBLE_CLICK())
  }, [dispatch])

  const itemData = {
    data,
    columnWidthsAdjusted,
    getRowHeight,
    sheetResults,
    handleDoubleClick,
  }

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
        extraTopLeftElement={<CommonPane key="top-left-pane" type="TOP_LEFT" />}
        extraTopRightElement={
          <CommonPane key="top-right-pane" type="TOP_RIGHT" />
        }
        extraBottomLeftElement={
          <CommonPane key="bottom-left-pane" type="BOTTOM_LEFT" />
        }
        extraBottomRightElement={
          <CommonPane key="bottom-right-pane" type="BOTTOM_RIGHT" />
        }
      >
        {Cell}
      </VariableSizeGrid>
    </div>
  )
}

const SheetSizer: FunctionComponent<Size> = ({ height, width }) => (
  <ContextMenuTrigger id="react-context-menu">
    <Sheet height={height} width={width} />
  </ContextMenuTrigger>
)

const SheetContainer: FunctionComponent = () => (
  <div className="sheet">
    <AutoSizer children={SheetSizer} />
    <CustomContextMenu />
  </div>
)

export default SheetContainer
