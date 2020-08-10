import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  KeyboardEvent,
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
  // THUNK_KEY_ENTER,
  THUNK_CELL_KEY_DELETE,
} from '../../redux/thunks/keyboard'
import EditorCell from './EditableCell'

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

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
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
      )}
    </ReactReduxContext.Consumer>
  )
}

const CanvasSheetInnerContent: FunctionComponent = () => {
  const dispatch = useDispatch()

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
        dispatch(ExcelActions.CELL_EDITOR_STATE_START())
      } else {
        switch (key) {
          case 'Enter':
            // dispatch(THUNK_KEY_ENTER(sheetRef))
            break
          case 'Delete':
            dispatch(THUNK_CELL_KEY_DELETE())
            break
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
          default:
            break
        }
      }
    },
    [dispatch]
  )

  return (
    <div
      id="sheet"
      className="sheetGrid"
      style={STYLE_SHEET}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <AutoSizer>
        {({ height, width }) => <CanvasSheet height={height} width={width} />}
      </AutoSizer>
      <EditorCell />
    </div>
  )
}

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
