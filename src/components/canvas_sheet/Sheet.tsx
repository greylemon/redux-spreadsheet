import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  KeyboardEvent,
} from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import {
  shallowEqual,
  useDispatch,
  ReactReduxContext,
  Provider,
} from 'react-redux'
import { ContextMenuTrigger } from 'react-contextmenu'
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
import {
  selectIsActiveCellInBottomRightPane,
  selectIsActiveCellInBottomLeftPane,
  selectIsActiveCellInTopRightPane,
  selectIsActiveCellInTopLeftPane,
  selectIsAreaInBottomRightPane,
  selectIsAreaInBottomLeftPane,
  selectIsAreaInTopRightPane,
  selectIsAreaInTopLeftPane,
} from '../../redux/selectors/pane'
import {
  THUNK_TOGGLE_BOLD,
  THUNK_TOGGLE_UNDERLINE,
  THUNK_TOGGLE_ITALIC,
  THUNK_TOGGLE_STRIKETHROUGH,
} from '../../redux/thunks/style'
import {
  THUNK_KEY_ENTER,
  THUNK_CELL_KEY_DELETE,
  THUNK_START_KEY_EDIT,
  THUNK_CELL_KEY_DOWN,
  THUNK_CELL_KEY_RIGHT,
  THUNK_CELL_KEY_UP,
  THUNK_CELL_KEY_LEFT,
} from '../../redux/thunks/keyboard'
import EditorCell from './EditableCell'
import { contextMenuId } from '../../constants/misc'
import CustomContextMenu from '../sheet/CustomContextMenu/CustomContextMenu'
import { sheetContainerId } from '../../constants/ids'
import { getEndDimension } from '../../tools/dimensions'
import { THUNK_MOUSE_DOUBLE_CLICK } from '../../redux/thunks/mouse'

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
    tableRowCount,
    rowOffsets,
    columnOffsets,
    viewRowStart,
    viewColumnStart,
    topLeftPositionX,
    topLeftPositionY,
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

      topLeftPositionY: selectTopLeftPositionY(state),
      topLeftPositionX: selectTopLeftPositionX(state),

      rowOffsets: selectRowOffsets(state),
      columnOffsets: selectColumnOffsets(state),

      viewRowStart: selectTopLeftPositionY(state),
      viewColumnStart: selectTopLeftPositionX(state),
    }),
    shallowEqual
  )

  const itemData = useMemo(
    (): ICanvasItemData => ({
      data,
      sheetResults,
      rowOffsets,
      columnOffsets,
      // viewWidths,
    }),
    [data, sheetResults, rowOffsets, columnOffsets]
  )

  const viewRowEnd = useMemo(
    () =>
      getEndDimension(
        topLeftPositionY,
        rowOffsets,
        tableFreezeRowCount - 1,
        height,
        tableRowCount
      ),
    [topLeftPositionY, rowOffsets, tableFreezeRowCount, height, tableRowCount]
  )

  const viewColumnEnd = useMemo(
    () =>
      getEndDimension(
        topLeftPositionX,
        columnOffsets,
        tableFreezeColumnCount - 1,
        width,
        tableColumnCount
      ),
    [
      topLeftPositionX,
      columnOffsets,
      tableFreezeColumnCount,
      width,
      tableColumnCount,
    ]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event

      if (ctrlKey || metaKey) {
        switch (key) {
          case 'A':
          case 'a':
            dispatch(ExcelActions.SELECT_ALL())
            event.preventDefault()
            break
          case 'B':
          case 'b':
            dispatch(THUNK_TOGGLE_BOLD())
            break
          case 'U':
          case 'u':
            dispatch(THUNK_TOGGLE_UNDERLINE())
            event.preventDefault()
            break
          case 'I':
          case 'i':
            dispatch(THUNK_TOGGLE_ITALIC())
            break
          case 'X':
          case 'x':
            dispatch(THUNK_TOGGLE_STRIKETHROUGH())
            break
          default:
            break
        }
      } else if (key.length === 1) {
        dispatch(THUNK_START_KEY_EDIT())
      } else {
        switch (key) {
          case 'Enter':
            dispatch(THUNK_KEY_ENTER())
            break
          case 'Delete':
            dispatch(THUNK_CELL_KEY_DELETE())
            break
          case 'ArrowDown':
            dispatch(THUNK_CELL_KEY_DOWN())
            break
          case 'ArrowRight':
            dispatch(THUNK_CELL_KEY_RIGHT())
            break
          case 'ArrowLeft':
            dispatch(THUNK_CELL_KEY_LEFT())
            break
          case 'ArrowUp':
            dispatch(THUNK_CELL_KEY_UP())
            break
          default:
            break
        }
      }
    },
    [dispatch]
  )

  const handleDoubleClick = useCallback(
    () => dispatch(THUNK_MOUSE_DOUBLE_CLICK()),
    [dispatch]
  )

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <div
          id={sheetContainerId}
          className="sheetGrid"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          onDoubleClick={handleDoubleClick}
        >
          <Stage height={height} width={width}>
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
                  selectIsAreaInPane={selectIsAreaInBottomRightPane}
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
                  selectIsAreaInPane={selectIsAreaInBottomLeftPane}
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
                  selectIsAreaInPane={selectIsAreaInTopRightPane}
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
                  selectIsAreaInPane={selectIsAreaInTopLeftPane}
                  enableColumnHeader
                  enableRowHeader
                />
              </Layer>
            </Provider>
          </Stage>
          <EditorCell />
        </div>
      )}
    </ReactReduxContext.Consumer>
  )
}

const CanvasSheetInnerContent: FunctionComponent = () => (
  <AutoSizer>
    {({ height, width }) => (
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
        <CanvasSheet height={height} width={width} />
      </ContextMenuTrigger>
    )}
  </AutoSizer>
)

export const CanvasSheetMainContent: FunctionComponent = () => (
  <div style={STYLE_SHEET}>
    <CanvasSheetInnerContent />
    <CustomContextMenu />
  </div>
)

const CanvasSheetHorizontalContent: FunctionComponent = () => (
  <div style={STYLE_SHEET_OUTER}>
    <CanvasSheetMainContent />
    <CanvasHorizontalScroll />
  </div>
)

export const CanvasSheetVerticalContent: FunctionComponent = () => (
  <div style={STYLE_SHEET_CONTENT}>
    <CanvasSheetHorizontalContent />
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
      <CanvasSheetVerticalContent />
    </div>
  )
}

export default CanvasSheetContainer
