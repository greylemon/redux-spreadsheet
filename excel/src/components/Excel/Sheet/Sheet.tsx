import React, { Fragment } from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../../redux'
import { shallowEqual } from 'react-redux'
import Cell from './Cell'
import {
  selectColumnCount,
  selectColumnWidths,
  selectRowCount,
  selectData,
  selectFreezeRowCount,
  selectFreezeColumnCount,
  selectGetRowHeight,
  selectGetColumnWidth,
} from '../../../redux/ExcelStore/selectors'
import BottomRightPane from './BottomRightPane'
import WindowListener from './WindowListener'

export const Sheet = ({ height, width }: Size) => {
  const {
    columnCount,
    rowCount,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
  } = useTypedSelector(
    (state) => ({
      columnCount: selectColumnCount(state),
      columnWidths: selectColumnWidths(state),
      rowCount: selectRowCount(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectFreezeRowCount(state) + 1,
      tableFreezeColumnCount: selectFreezeColumnCount(state) + 1,
    }),
    shallowEqual
  )

  const itemData = { data }

  return (
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
  )
}

const SheetSizer = ({ height, width }: Size) => (
  <Fragment>
    <Sheet height={height} width={width} />
    <WindowListener />
  </Fragment>
)

const SheetContainer = () => <AutoSizer children={SheetSizer} />

export default SheetContainer
