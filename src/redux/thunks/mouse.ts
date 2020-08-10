import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import {
  selectScrollOffsetY,
  selectScrollOffsetX,
  selectIsRowDrag,
  selectIsColumnDrag,
  selectDragRowIndex,
  selectDragColumnIndex,
  selectDragRowOffset,
  selectDragColumnOffset,
  selectSelectionArea,
  selectIsSelectionMode,
  selectIsEditMode,
  // selectLastVisitedCell,
  // selectScrollHorizontal,
  // selectScrollVertical,
  // selectSheetDimensions,
} from '../selectors/base'
import {
  IPosition,
  // IArea,
  IRowIndex,
  IColumnIndex,
} from '../../@types/state'
import {
  // boundPositionInOrderedArea,
  // checkIsPositionEqualOtherPosition,
  // getEditableCellPositionFromBoundedPosition,
  denormalizeRowHeight,
  denormalizeColumnWidth,
} from '../../tools'
import {
  selectRowOffsets,
  selectGetRowHeight,
  selectColumnOffsets,
  selectGetColumnWidth,
} from '../selectors/custom'
// import { getDocumentOffsetPosition } from '../../tools/dom'
import {
  selectFreezeRowCount,
  selectFreezeColumnCount,
  // selectColumnCount,
  // selectRowCount,
} from '../selectors/activeSheet'
import {
  dispatchSaveActiveCell,
  getGeneralActionPayload,
} from '../tools/history'
// import {
//   SHEET_ROW_HEIGHT_HEADER,
//   SHEET_COLUMN_WIDTH_HEADER,
// } from '../../constants/defaults'
import { ICellTypes } from '../../@types/general'

export const THUNK_MOUSE_UP = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const selectionArea = selectSelectionArea(state)
  const isRowDrag = selectIsRowDrag(state)
  const isColumnDrag = selectIsColumnDrag(state)

  if (selectionArea) {
    dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
  } else if (isRowDrag) {
    const rowOffsets = selectRowOffsets(state)
    const dragRowIndex = selectDragRowIndex(state)
    const dragRowOffset = selectDragRowOffset(state)
    const scrollOffsetY = selectScrollOffsetY(state)
    const freezeRowCount = selectFreezeRowCount(state)

    let value = dragRowOffset - rowOffsets[dragRowIndex]

    if (dragRowIndex <= freezeRowCount) value -= scrollOffsetY

    dispatch(
      ExcelActions.ROW_DRAG_END({
        ...getGeneralActionPayload(state),
        dragRowIndex,
        height: denormalizeRowHeight(value + 8),
      })
    )
  } else if (isColumnDrag) {
    const columnOffsets = selectColumnOffsets(state)
    const dragColumnIndex = selectDragColumnIndex(state)
    const dragColumnOffset = selectDragColumnOffset(state)
    const scrollOffsetX = selectScrollOffsetX(state)
    const freezeColumnCount = selectFreezeColumnCount(state)

    let value = dragColumnOffset - columnOffsets[dragColumnIndex]

    if (dragColumnIndex <= freezeColumnCount) value -= scrollOffsetX

    dispatch(
      ExcelActions.COLUMN_DRAG_END({
        ...getGeneralActionPayload(state),
        dragColumnIndex,
        width: denormalizeColumnWidth(value + 8),
      })
    )
  }
}

export const THUNK_MOUSE_ENTER = (
  type: ICellTypes,
  position: IPosition
): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isSelectionMode = selectIsSelectionMode(state)

  if (isSelectionMode) {
    switch (type) {
      case 'cell': {
        dispatch(ExcelActions.CELL_MOUSE_ENTER(position))
        break
      }
      default:
        break
    }
  }
}

export const THUNK_MOUSE_MOVE_OUT = (): // mousePosition: IPosition,
// shiftKey?: boolean,
// ctrlKey?: boolean
IAppThunk => (dispatch, getState) => {
  const state = getState()

  if (
    selectIsSelectionMode(state) ||
    selectIsRowDrag(state) ||
    selectIsColumnDrag(state) ||
    selectDragColumnIndex(state) ||
    selectDragRowIndex(state)
  ) {
    const sheet = document.getElementById('sheet')

    if (sheet) {
      if (selectIsSelectionMode(state)) {
        // const sheetDimensions = selectSheetDimensions(state)
      }
      // else if (selectIsRowDrag(state)) {
      // } else if (selectIsColumnDrag(state)) {
      // } else if (selectDragColumnIndex(state) || selectDragRowIndex(state)) {
      // }
    }
  }
}

export const THUNK_MOUSE_ENTER_DRAG_ROW = (rowIndex: IRowIndex): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const rowOffsets = selectRowOffsets(state)
  const rowHeightGetter = selectGetRowHeight(state)

  dispatch(
    ExcelActions.ROW_DRAG_ENTER({
      dragRowIndex: rowIndex,
      dragRowOffset: rowOffsets[rowIndex] + rowHeightGetter(rowIndex) - 8,
    })
  )
}

export const THUNK_MOUSE_ENTER_DRAG_COLUMN = (
  columnIndex: IColumnIndex
): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const columnOffsets = selectColumnOffsets(state)
  const columnWidthGetter = selectGetColumnWidth(state)

  dispatch(
    ExcelActions.COLUMN_DRAG_ENTER({
      dragColumnIndex: columnIndex,
      dragColumnOffset:
        columnOffsets[columnIndex] + columnWidthGetter(columnIndex) - 8,
    })
  )
}

export const THUNK_MOUSE_DOWN = (
  type: ICellTypes,
  position: IPosition,
  shiftKey: boolean,
  ctrlKey: boolean
): IAppThunk => (dispatch, getState) => {
  switch (type) {
    case 'cell': {
      const state = getState()
      if (selectIsEditMode(state)) dispatchSaveActiveCell(dispatch, state)

      if (ctrlKey) {
        dispatch(ExcelActions.CELL_MOUSE_DOWN_CTRL(position))
      } else if (shiftKey) {
        dispatch(ExcelActions.CELL_MOUSE_DOWN_SHIFT(position))
      } else {
        dispatch(ExcelActions.CELL_MOUSE_DOWN(position))
      }
      break
    }
    default:
      break
  }
}

export const THUNK_MOUSE_DOUBLE_CLICK = (type: ICellTypes): IAppThunk => (
  dispatch
) => {
  switch (type) {
    case 'cell': {
      dispatch(ExcelActions.CELL_DOUBLE_CLICK())
      break
    }
    default:
      break
  }
}
