import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Stage } from 'react-konva'
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
  selectTableColumnCount,
  selectTableRowCount,
  selectGetColumnWidth,
  selectGetRowHeight,
  selectTableFreezeRowCount,
  selectTableFreezeColumnCount,
  selectColumnWidthsAdjusted,
  selectCellLayering,
  selectScrollColumnOffsets,
  selectScrollRowOffsets,
  selectViewRowEnd,
  selectViewColumnEnd,
} from '../../redux/selectors/custom'
import GenericPane from './GenericPane'
import { ExcelActions } from '../../redux/store'
import {
  selectScrollTopLeftPositionY,
  selectScrollTopLeftPositionX,
} from '../../redux/selectors/base'
import { CanvasHorizontalScroll, CanvasVerticalScroll } from './Scroll'

const CanvasSheet: FunctionComponent<Size> = ({ height, width }) => {
  const dispatch = useDispatch()
  const {
    // sheetResults,
    // tableColumnCount,
    // tableRowCount,
    // data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
    // columnWidthsAdjusted,
    // cellLayering,
    rowOffsets,
    columnOffsets,
    viewColumnEnd,
    viewRowEnd,
    viewRowStart,
    viewColumnStart,
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
      cellLayering: selectCellLayering(state),
      rowOffsets: selectScrollRowOffsets(state),
      columnOffsets: selectScrollColumnOffsets(state),
      viewRowEnd: selectViewRowEnd(state),
      viewColumnEnd: selectViewColumnEnd(state),
      viewRowStart: selectScrollTopLeftPositionY(state),
      viewColumnStart: selectScrollTopLeftPositionX(state),
    }),
    shallowEqual
  )

  useEffect(() => {
    dispatch(ExcelActions.UPDATE_SHEET_DIMENSIONS({ x: width, y: height }))
  }, [dispatch, height, width])

  return (
    <Stage height={height} width={width}>
      <GenericPane
        columnStart={viewColumnStart}
        columnEnd={viewColumnEnd}
        rowStart={viewRowStart}
        rowEnd={viewRowEnd}
        columnOffsets={columnOffsets}
        rowOffsets={rowOffsets}
        getColumnWidth={getColumnWidth}
        getRowHeight={getRowHeight}
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
      />
      {/* top right */}
      <GenericPane
        columnStart={viewColumnStart}
        columnEnd={viewColumnEnd}
        rowStart={0}
        rowEnd={tableFreezeRowCount}
        columnOffsets={columnOffsets}
        rowOffsets={rowOffsets}
        getColumnWidth={getColumnWidth}
        getRowHeight={getRowHeight}
      />
      {/* top left */}
      <GenericPane
        columnStart={0}
        columnEnd={tableFreezeColumnCount}
        rowStart={0}
        rowEnd={tableFreezeRowCount}
        columnOffsets={columnOffsets}
        rowOffsets={rowOffsets}
        getColumnWidth={getColumnWidth}
        getRowHeight={getRowHeight}
      />
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
