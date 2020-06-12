import React, { KeyboardEvent } from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../../redux'
import { shallowEqual, useDispatch } from 'react-redux'
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
import { ExcelStore } from '../../../redux/ExcelStore/store'

export const Sheet = ({ height, width }: Size) => {
  const dispatch = useDispatch()
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

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key, shiftKey } = event

    if (shiftKey) {
      // TODO
      return
    } else {
      switch (key) {
        case 'ArrowDown':
          dispatch(ExcelStore.actions.CELL_KEY_DOWN())
          break
        case 'ArrowRight':
          dispatch(ExcelStore.actions.CELL_KEY_RIGHT())
          break
        case 'ArrowLeft':
          dispatch(ExcelStore.actions.CELL_KEY_LEFT())
          break
        case 'ArrowUp':
          dispatch(ExcelStore.actions.CELL_KEY_UP())
          break
      }
    }
  }

  return (
    <div tabIndex={-1} onKeyDown={handleKeyDown}>
      <VariableSizeGrid
        className="sheet"
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

const SheetContainer = () => <AutoSizer children={SheetSizer} />

export default SheetContainer
