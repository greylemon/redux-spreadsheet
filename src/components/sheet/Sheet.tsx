import React, {
  useEffect,
  useRef,
  FunctionComponent,
  useCallback,
  KeyboardEvent,
  useMemo,
} from 'react'
import { VariableSizeGrid, GridOnScrollProps } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { shallowEqual, useDispatch } from 'react-redux'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useTypedSelector } from '../../redux/redux'
import Cell from './Cell'
import {
  selectGetRowHeight,
  selectGetColumnWidth,
  selectColumnWidthsAdjusted,
  selectTableRowCount,
  selectTableColumnCount,
  selectTableFreezeRowCount,
  selectTableFreezeColumnCount,
  selectCellLayering,
  selectRowOffsets,
  selectColumnOffsets,
} from '../../redux/selectors/custom'
import {
  selectData,
  selectActiveResults,
} from '../../redux/selectors/activeSheet'
import CommonPane from './CommonPane'

import CustomContextMenu from './CustomContextMenu/CustomContextMenu'
import { ExcelActions } from '../../redux/store'
import STYLE_SHEET from './style'
import { IItemData } from '../../@types/components'
import {
  THUNK_KEY_ENTER,
  THUNK_TOGGLE_BOLD,
  THUNK_TOGGLE_UNDERLINE,
  THUNK_TOGGLE_ITALIC,
  THUNK_TOGGLE_STRIKETHROUGH,
} from '../../redux/thunks/keyboard'

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
    cellLayering,
    rowOffsets,
    columnOffsets,
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
      rowOffsets: selectRowOffsets(state),
      columnOffsets: selectColumnOffsets(state),
    }),
    shallowEqual
  )

  useEffect(() => {
    const { current } = gridRef

    if (current) current.resetAfterIndices({ columnIndex: 0, rowIndex: 0 })
  }, [getColumnWidth, getRowHeight])

  const handleDoubleClick = useCallback(() => {
    dispatch(ExcelActions.CELL_DOUBLE_CLICK())
  }, [dispatch])

  const itemData: IItemData = {
    data,
    columnWidthsAdjusted,
    sheetResults,
    cellLayering,
    handleDoubleClick,
    rowOffsets,
    columnOffsets,
  }

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
            dispatch(THUNK_KEY_ENTER())
            break
          case 'Delete':
            dispatch(ExcelActions.CELL_KEY_DELETE())
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

  const handleUpdateScroll = useCallback(
    (scrollProps: GridOnScrollProps) => {
      dispatch(
        ExcelActions.UPDATE_SCROLL_OFFSET({
          x: scrollProps.scrollLeft,
          y: scrollProps.scrollTop,
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch(ExcelActions.UPDATE_SHEET_DIMENSIONS({ x: width, y: height }))
  }, [dispatch, height, width])

  const extraTopLeftElement = useMemo(
    () => <CommonPane key="top-left-pane" type="TOP_LEFT" />,
    []
  )
  const extraTopRightElement = useMemo(
    () => <CommonPane key="top-right-pane" type="TOP_RIGHT" />,
    []
  )
  const extraBottomLeftElement = useMemo(
    () => <CommonPane key="bottom-left-pane" type="BOTTOM_LEFT" />,
    []
  )
  const extraBottomRightElement = useMemo(
    () => <CommonPane key="bottom-right-pane" type="BOTTOM_RIGHT" />,
    []
  )

  return (
    <div
      id="sheet"
      className="sheetGrid"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
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
        extraTopLeftElement={extraTopLeftElement}
        extraTopRightElement={extraTopRightElement}
        extraBottomLeftElement={extraBottomLeftElement}
        extraBottomRightElement={extraBottomRightElement}
        onScroll={handleUpdateScroll}
      >
        {Cell}
      </VariableSizeGrid>
    </div>
  )
}

const SheetSizer: FunctionComponent<Size> = ({ height, width }) => (
  <ContextMenuTrigger id="react-context-menu" holdToDisplay={-1}>
    <Sheet height={height} width={width} />
  </ContextMenuTrigger>
)

const SheetContainer: FunctionComponent = () => (
  <div style={STYLE_SHEET}>
    <AutoSizer>{SheetSizer}</AutoSizer>
    <CustomContextMenu />
  </div>
)

export default SheetContainer
