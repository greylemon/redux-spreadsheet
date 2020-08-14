import IRootStore, { IAppThunk } from '../../@types/store'
import {
  selectIsEditMode,
  selectSelectionAreaIndex,
  selectActiveCellPositionRow,
  selectTopLeftPositionY,
  selectActiveCellPositionColumn,
  selectTopLeftPositionX,
} from '../selectors/base'
import { ExcelActions } from '../store'
import {
  dispatchSaveActiveCell,
  getGeneralActionPayload,
} from '../tools/history'
import { computeInputPosition } from '../tools/offset'
import {
  getSheetContainer,
  getSheetHeight,
  getEndDimension,
  getSheetWidth,
} from '../../tools'
import {
  selectTableFreezeColumnCount,
  selectTableFreezeRowCount,
  selectRowOffsets,
  selectTableRowCount,
  selectColumnOffsets,
  selectTableColumnCount,
} from '../selectors/custom'
import {
  selectFreezeRowCount,
  selectFreezeColumnCount,
} from '../selectors/activeSheet'
import { getScrollbarSize } from '../../tools/misc'

export const THUNK_START_KEY_EDIT = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(ExcelActions.CELL_EDITOR_STATE_START(computeInputPosition(state)))
}

export const THUNK_KEY_ENTER = (): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isEditMode = selectIsEditMode(state)
  const selectionAreaIndex = selectSelectionAreaIndex(state)

  if (!isEditMode && selectionAreaIndex === -1) {
    dispatch(THUNK_START_KEY_EDIT())
  } else {
    dispatchSaveActiveCell(dispatch, state)
    dispatch(ExcelActions.CELL_EDITOR_STATE_END())

    const container = getSheetContainer()
    if (container) container.focus()
  }
}

export const THUNK_CELL_KEY_DELETE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  if (!selectIsEditMode(state))
    dispatch(ExcelActions.CELL_KEY_DELETE(getGeneralActionPayload(state)))
}

const increase = (dimension: number, start: number, end: number) =>
  dimension >= end ? start + 1 : start

const decrease = (dimension: number, start: number, freeze: number) =>
  dimension <= start && dimension > freeze && start > freeze ? start - 1 : start

const decreaseWithState = (
  state: IRootStore,
  selectDimension: any,
  selectStart: any,
  selectTableFreeze: any
) => {
  const dimension = selectDimension(state)
  const start = selectStart(state)
  const tableFreeze = selectTableFreeze(state)

  return decrease(dimension, start, tableFreeze)
}

export const increaseWithState = (
  state: IRootStore,
  selectDimension: any,
  selectStart: any,
  selectFreeze: any,
  selectOffsets: any,
  selectTableDimensionCount: any,
  screenDimension: number
) => {
  const dimension = selectDimension(state)
  const start = selectStart(state)
  const offsets = selectOffsets(state)
  const freeze = selectFreeze(state)
  const tableDimensionCount = selectTableDimensionCount(state)
  const end = getEndDimension(
    start,
    offsets,
    freeze,
    screenDimension,
    tableDimensionCount
  )

  return increase(dimension, start, end)
}

export const THUNK_CELL_KEY_UP = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(
    ExcelActions.CELL_KEY_UP(
      decreaseWithState(
        state,
        selectActiveCellPositionRow,
        selectTopLeftPositionY,
        selectTableFreezeRowCount
      )
    )
  )
}

export const THUNK_CELL_KEY_DOWN = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(
    ExcelActions.CELL_KEY_DOWN(
      increaseWithState(
        state,
        selectActiveCellPositionRow,
        selectTopLeftPositionY,
        selectFreezeRowCount,
        selectRowOffsets,
        selectTableRowCount,
        getSheetHeight() - getScrollbarSize()
      )
    )
  )
}

export const THUNK_CELL_KEY_LEFT = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(
    ExcelActions.CELL_KEY_LEFT(
      decreaseWithState(
        state,
        selectActiveCellPositionColumn,
        selectTopLeftPositionX,
        selectTableFreezeColumnCount
      )
    )
  )
}

export const THUNK_CELL_KEY_RIGHT = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  dispatch(
    ExcelActions.CELL_KEY_RIGHT(
      increaseWithState(
        state,
        selectActiveCellPositionColumn,
        selectTopLeftPositionX,
        selectFreezeColumnCount,
        selectColumnOffsets,
        selectTableColumnCount,
        getSheetWidth() - getScrollbarSize()
      )
    )
  )
}
