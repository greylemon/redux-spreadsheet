import { IAppThunk } from '../../@types/store'
import { IGridRef } from '../../@types/ref'
import {
  selectIsSelectionMode,
  selectScrollHorizontal,
  selectScrollVertical,
  selectSelectionArea,
} from '../selectors/base'
import { IPosition } from '../../@types/state'
import { ExcelActions } from '../store'
import { selectColumnCount, selectRowCount } from '../selectors/activeSheet'

export const THUNK_UPDATE_SCROLL_EVENT = (gridRef: IGridRef): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()

  const isSelectionMode = selectIsSelectionMode(state)

  if (isSelectionMode) {
    const scrollHorizontal = selectScrollHorizontal(state)
    const scrollVertical = selectScrollVertical(state)

    const selectionArea = selectSelectionArea(state)
    const position: IPosition = { ...selectionArea.end }

    let rowIndex = position.y
    let columnIndex = position.x

    gridRef.current.scrollToItem({
      align: 'smart',
      rowIndex: rowIndex === 1 ? 0 : rowIndex,
      columnIndex: columnIndex === 1 ? 0 : columnIndex,
    })

    switch (scrollHorizontal) {
      case 'right':
        columnIndex = Math.min(position.x + 1, selectColumnCount(state))
        break
      case 'left':
        columnIndex = Math.max(position.x - 1, 1)
        break
      default:
        columnIndex = position.x
        break
    }

    switch (scrollVertical) {
      case 'bottom':
        rowIndex = Math.min(position.y + 1, selectRowCount(state))
        break
      case 'top':
        rowIndex = Math.max(position.y - 1, 1)
        break
      default:
        rowIndex = position.y
        break
    }

    dispatch(ExcelActions.CELL_MOUSE_ENTER({ x: columnIndex, y: rowIndex }))
  }
}
