import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { shallowEqual, useDispatch } from 'react-redux'
import {
  STYLE_SHEET,
  STYLE_SHEET_CONTAINER,
  STYLE_SHEET_OUTER,
  STYLE_SHEET_CONTENT,
} from '../sheet/style'
import { useTypedSelector } from '../../redux/redux'
import {
  selectActiveResults,
  selectData,
} from '../../redux/selectors/activeSheet'
import {
  selectGetColumnWidth,
  selectGetRowHeight,
  selectTableFreezeRowCount,
  selectTableFreezeColumnCount,
  selectViewRowEnd,
  selectViewColumnEnd,
  selectTableRowCount,
  selectTableColumnCount,
  selectVisibleCellWidths,
  selectRowOffsets,
  selectColumnOffsets,
} from '../../redux/selectors/custom'
import GenericPane from './GenericPane'
import { ExcelActions } from '../../redux/store'
import {
  selectTopLeftPositionY,
  selectTopLeftPositionX,
} from '../../redux/selectors/base'
import { CanvasHorizontalScroll, CanvasVerticalScroll } from './Scroll'
import Cell from './text_layer/Cell'
import { ICanvasItemData } from '../../@types/components'

const CanvasSheet: FunctionComponent<Size> = ({ height, width }) => {
  const dispatch = useDispatch()
  const {
    sheetResults,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
    tableColumnCount,
    // tableRowCount,
    rowOffsets,
    columnOffsets,
    // viewColumnEnd,
    viewRowEnd,
    viewRowStart,
    viewColumnStart,
    viewWidths,
  } = useTypedSelector(
    (state) => ({
      sheetResults: selectActiveResults(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectTableFreezeRowCount(state),
      tableFreezeColumnCount: selectTableFreezeColumnCount(state),

      tableRowCount: selectTableRowCount(state),
      tableColumnCount: selectTableColumnCount(state),
      viewRowEnd: selectViewRowEnd(state),
      viewColumnEnd: selectViewColumnEnd(state),

      viewWidths: selectVisibleCellWidths(state),

      rowOffsets: selectRowOffsets(state),
      columnOffsets: selectColumnOffsets(state),

      viewRowStart: selectTopLeftPositionY(state),
      viewColumnStart: selectTopLeftPositionX(state),
    }),
    shallowEqual
  )

  useEffect(() => {
    dispatch(ExcelActions.UPDATE_SHEET_DIMENSIONS({ x: width, y: height }))
  }, [dispatch, height, width])

  const itemData: ICanvasItemData = {
    data,
    sheetResults,
    rowOffsets,
    columnOffsets,
    viewWidths,
  }

  return (
    <Stage height={height} width={width}>
      <Layer>
        <GenericPane
          columnStart={tableFreezeColumnCount}
          rowStart={viewRowStart}
          columnEnd={tableColumnCount}
          rowEnd={viewRowEnd}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
          topLeftPositionX={viewColumnStart}
          topLeftPositionY={viewRowStart}
          tableFreezeRowCount={tableFreezeRowCount}
          tableFreezeColumnCount={tableFreezeColumnCount}
        />
        {/* bottom left */}
        <GenericPane
          columnStart={0}
          columnEnd={tableFreezeColumnCount}
          rowStart={viewRowStart}
          rowEnd={viewRowEnd}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
          topLeftPositionY={viewRowStart}
          tableFreezeRowCount={tableFreezeRowCount}
        />
        {/* top right */}
        <GenericPane
          columnStart={tableFreezeColumnCount}
          rowStart={0}
          columnEnd={tableColumnCount}
          rowEnd={tableFreezeRowCount}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
          topLeftPositionX={viewColumnStart}
          tableFreezeColumnCount={tableFreezeColumnCount}
        />
        {/* top left */}
        <GenericPane
          columnStart={0}
          rowStart={0}
          columnEnd={tableFreezeColumnCount}
          rowEnd={tableFreezeRowCount}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
        />
      </Layer>
    </Stage>
  )
}

const CanvasSheetInnerContent: FunctionComponent = () => (
  <div style={STYLE_SHEET}>
    <AutoSizer>
      {({ height, width }) => <CanvasSheet height={height} width={width} />}
    </AutoSizer>
  </div>
)

const CanvasSheetOuterContent: FunctionComponent = () => (
  <div style={STYLE_SHEET_OUTER}>
    <CanvasSheetInnerContent />
    <CanvasHorizontalScroll />
  </div>
)

export const CanvasSheetContent: FunctionComponent = () => (
  <div style={STYLE_SHEET_CONTENT}>
    <CanvasSheetOuterContent />
    <CanvasVerticalScroll />
  </div>
)

const CanvasSheetContainer: FunctionComponent = () => {
  const dispatch = useDispatch()

  // CONVERT TO THUNK AND BOUND
  const handleScroll = useCallback(
    ({ deltaY, deltaX }) => {
      if (deltaY > 0) {
        dispatch(ExcelActions.SCROLL_DOWN())
      } else if (deltaY < 0) {
        dispatch(ExcelActions.SCROLL_UP())
      } else if (deltaX > 0) {
        dispatch(ExcelActions.SCROLL_RIGHT())
      } else if (deltaX < 0) {
        dispatch(ExcelActions.SCROLL_LEFT())
      }
    },
    [dispatch]
  )

  return (
    <div style={STYLE_SHEET_CONTAINER} onWheel={handleScroll}>
      <CanvasSheetContent />
    </div>
  )
}

export default CanvasSheetContainer
