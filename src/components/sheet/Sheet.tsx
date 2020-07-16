import React, {
  useEffect,
  useRef,
  FunctionComponent,
  useCallback,
  KeyboardEvent,
} from 'react'
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
import CustomContextMenu from './CustomContextMenu/CustomContextMenu'
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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { shiftKey, key, ctrlKey, metaKey } = event

      if (!ctrlKey || metaKey) {
        if (key.length === 1) {
          dispatch(ExcelActions.CELL_EDITOR_STATE_START())
        } else if (key === 'Delete') {
          dispatch(ExcelActions.CELL_KEY_DELETE())
        } else {
          if (shiftKey) {
            // TODO
            return
          } else {
            switch (key) {
              case 'ArrowDown':
                dispatch(ExcelActions.CELL_KEY_DOWN())
                break
              case 'ArrowRight':
                dispatch(ExcelActions.CELL_KEY_RIGHT())
                break
              case 'ArrowLeft':
                dispatch(ExcelActions.CELL_KEY_LEFT())
                break
              case 'ArrowUp':
                dispatch(ExcelActions.CELL_KEY_UP())
                break
            }
          }
        }
      }
    },
    [dispatch]
  )

  return (
    <div className="sheetGrid" tabIndex={-1} onKeyDown={handleKeyDown}>
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
