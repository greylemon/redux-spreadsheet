import { IAppThunk } from '../../@types/store'
import { IGridRef } from '../../@types/ref'
import {
  selectIsSelectionMode,
  selectScrollHorizontal,
  selectScrollVertical,
  selectSelectionArea,
  selectTopLeftPositionY,
  selectTopLeftPositionX,
} from '../selectors/base'
import { IPosition } from '../../@types/state'
import { ExcelActions } from '../store'
import { selectColumnCount, selectRowCount } from '../selectors/activeSheet'
import {
  IVerticalOffsetType,
  IHorizontalOffsetType,
} from '../../@types/general'

export const THUNK_UPDATE_SCROLL_EVENT = (
  gridRef: IGridRef,
  startedScrollVertical: IVerticalOffsetType,
  startedScrollHorizontal: IHorizontalOffsetType
): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isSelectionMode = selectIsSelectionMode(state)
  const scrollHorizontal = selectScrollHorizontal(state)
  const scrollVertical = selectScrollVertical(state)

  if (
    isSelectionMode &&
    (scrollHorizontal !== 'neutral' || scrollVertical !== 'neutral') &&
    scrollHorizontal === startedScrollHorizontal &&
    scrollVertical === startedScrollVertical
  ) {
    const selectionArea = selectSelectionArea(state)
    const position: IPosition = { ...selectionArea.end }

    let rowIndex = position.y
    let columnIndex = position.x
    const scrollPosition: IPosition = { ...position }

    switch (scrollHorizontal) {
      case 'right':
        columnIndex = Math.min(position.x + 1, selectColumnCount(state))
        scrollPosition.x += 1
        break
      case 'left':
        columnIndex = Math.max(position.x - 1, 1)
        scrollPosition.x -= 2
        break
      default:
        columnIndex = position.x
        break
    }

    switch (scrollVertical) {
      case 'bottom':
        rowIndex = Math.min(position.y + 1, selectRowCount(state))
        scrollPosition.y += 1
        break
      case 'top':
        rowIndex = Math.max(position.y - 1, 1)
        scrollPosition.y -= 2
        break
      default:
        rowIndex = position.y
        break
    }

    gridRef.current.scrollToItem({
      align: 'smart',
      rowIndex: scrollPosition.y,
      columnIndex: scrollPosition.x,
    })

    dispatch(ExcelActions.CELL_MOUSE_ENTER({ x: columnIndex, y: rowIndex }))
  }
}

const THUNK_SCROLL = (
  scroll: number,
  action: any,
  selectDimension: any
): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const oldScroll = selectDimension(state)

  if (oldScroll !== scroll) {
    dispatch(action(scroll))
  }
}

export const THUNK_VERTICAL_SCROLL = (scroll: number): IAppThunk =>
  THUNK_SCROLL(scroll, ExcelActions.SCROLL_VERTICAL, selectTopLeftPositionY)

export const THUNK_HORIZONTAL_SCROLL = (scroll: number): IAppThunk =>
  THUNK_SCROLL(scroll, ExcelActions.SCROLL_HORIZONTAL, selectTopLeftPositionX)
