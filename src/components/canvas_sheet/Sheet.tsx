import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { Stage, Layer } from 'react-konva'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import {
  shallowEqual,
  useDispatch,
  ReactReduxContext,
  Provider,
} from 'react-redux'
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
import Cell from './text/Cell'
import { ICanvasItemData } from '../../@types/components'
// import { THUNK_MOUSE_DOUBLE_CLICK } from '../../redux/thunks/mouse'
import { IPosition } from '../../@types/state'
import {
  selectIsActiveCellInBottomRightPane,
  selectIsActiveCellInBottomLeftPane,
  selectIsActiveCellInTopRightPane,
  selectIsActiveCellInTopLeftPane,
} from '../../redux/selectors/pane'

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

  const itemData: ICanvasItemData = useMemo(
    () => ({
      data,
      sheetResults,
      rowOffsets,
      columnOffsets,
      // viewWidths,
    }),
    [data, sheetResults, rowOffsets, columnOffsets]
  )

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

  const handleMouseDown = useCallback(
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

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <Stage
          height={height}
          width={width}
          onDblClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
        >
          <Provider store={store}>
            <Layer>
              <GenericPane
                id="bottom-right"
                columnStart={viewColumnStart}
                columnStartBound={tableFreezeColumnCount}
                columnOffsets={columnOffsets}
                columnEnd={viewColumnEnd}
                rowStart={viewRowStart}
                rowStartBound={tableFreezeRowCount}
                rowEnd={viewRowEnd}
                rowOffsets={rowOffsets}
                getColumnWidth={getColumnWidth}
                getRowHeight={getRowHeight}
                CellComponent={Cell}
                data={itemData}
                selectIsInPane={selectIsActiveCellInBottomRightPane}
              />
              <GenericPane
                id="bottom-left"
                columnStart={0}
                columnStartBound={0}
                columnEnd={tableFreezeColumnCount}
                columnOffsets={columnOffsets}
                rowStart={viewRowStart}
                rowStartBound={tableFreezeRowCount}
                rowEnd={viewRowEnd}
                rowOffsets={rowOffsets}
                getColumnWidth={getColumnWidth}
                getRowHeight={getRowHeight}
                CellComponent={Cell}
                data={itemData}
                selectIsInPane={selectIsActiveCellInBottomLeftPane}
                enableRowHeader
              />
              <GenericPane
                id="top-right"
                columnStart={viewColumnStart}
                columnStartBound={tableFreezeColumnCount}
                columnEnd={tableColumnCount}
                columnOffsets={columnOffsets}
                rowStart={0}
                rowStartBound={0}
                rowEnd={tableFreezeRowCount}
                rowOffsets={rowOffsets}
                getColumnWidth={getColumnWidth}
                getRowHeight={getRowHeight}
                CellComponent={Cell}
                data={itemData}
                selectIsInPane={selectIsActiveCellInTopRightPane}
                enableColumnHeader
              />
              <GenericPane
                id="top-left"
                columnStart={0}
                columnStartBound={0}
                columnEnd={tableFreezeColumnCount}
                columnOffsets={columnOffsets}
                rowStart={0}
                rowStartBound={0}
                rowEnd={tableFreezeRowCount}
                rowOffsets={rowOffsets}
                getColumnWidth={getColumnWidth}
                getRowHeight={getRowHeight}
                CellComponent={Cell}
                data={itemData}
                selectIsInPane={selectIsActiveCellInTopLeftPane}
                enableColumnHeader
                enableRowHeader
              />
            </Layer>
          </Provider>
        </Stage>
      )}
    </ReactReduxContext.Consumer>
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
    (event) => {
      const { deltaY, deltaX } = event
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
