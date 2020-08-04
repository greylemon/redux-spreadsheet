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
  // selectVisibleCellWidths,
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
// import { THUNK_MOUSE_DOUBLE_CLICK } from '../../redux/thunks/mouse'
import { IPosition } from '../../@types/state'

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
    viewColumnEnd,
    viewRowEnd,
    viewRowStart,
    viewColumnStart,
    // viewWidths,
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

      // viewWidths: selectVisibleCellWidths(state),

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
    // viewWidths,
  }

  const handleDoubleClick = useCallback(
    (event) => {
      const [, address] = event.currentTarget.clickStartShape.attrs.id.split(
        '='
      )
      const position: IPosition = JSON.parse(address)
      if (position.x || position.y) dispatch(ExcelActions.CELL_DOUBLE_CLICK())
    },
    [dispatch]
  )

  const handleClick = useCallback(
    ({ evt, currentTarget }) => {
      const [, address] = currentTarget.clickStartShape.attrs.id.split('=')
      const position: IPosition = JSON.parse(address)
      const {
        // ctrlKey,
        // shiftKey,
        button,
      } = evt

      switch (button) {
        case 0:
          dispatch(ExcelActions.CELL_MOUSE_DOWN(position))
          break
        case 2:
          break
        default:
          break
      }
    },
    [dispatch]
  )

  // ! OPTIMIZE THIS !
  return (
    <Stage
      height={height}
      width={width}
      onDblClick={handleDoubleClick}
      onClick={handleClick}
    >
      <Layer>
        <GenericPane
          columnStart={viewColumnStart}
          rowStart={viewRowStart}
          columnEnd={viewColumnEnd}
          rowEnd={viewRowEnd}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
          columnStartBound={tableFreezeColumnCount}
          rowStartBound={tableFreezeRowCount}
        />
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
          columnStartBound={0}
          rowStartBound={tableFreezeRowCount}
        />
        <GenericPane
          columnStart={viewColumnStart}
          columnEnd={tableColumnCount}
          rowStart={0}
          rowEnd={tableFreezeRowCount}
          columnOffsets={columnOffsets}
          rowOffsets={rowOffsets}
          getColumnWidth={getColumnWidth}
          getRowHeight={getRowHeight}
          CellComponent={Cell}
          data={itemData}
          columnStartBound={tableFreezeColumnCount}
          rowStartBound={0}
        />
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
          columnStartBound={0}
          rowStartBound={0}
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
