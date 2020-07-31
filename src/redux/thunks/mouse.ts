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
  selectLastVisitedCell,
  selectScrollHorizontal,
  selectScrollVertical,
} from '../selectors/base'
import { IPosition, IArea, IRowIndex, IColumnIndex } from '../../@types/state'
import {
  boundPositionInOrderedArea,
  checkIsPositionEqualOtherPosition,
  getEditableCellPositionFromBoundedPosition,
  denormalizeRowHeight,
  denormalizeColumnWidth,
} from '../../tools'
import {
  selectRowOffsets,
  selectGetRowHeight,
  selectColumnOffsets,
  selectGetColumnWidth,
} from '../selectors/custom'
import { getDocumentOffsetPosition } from '../../tools/dom'
import {
  selectFreezeRowCount,
  selectFreezeColumnCount,
  selectColumnCount,
  selectRowCount,
} from '../selectors/activeSheet'
import {
  dispatchSaveActiveCell,
  getGeneralActionPayload,
} from '../tools/history'
import { IGridRef } from '../../@types/ref'

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

export const THUNK_MOUSE_MOVE = (
  mousePosition: IPosition,
  gridRef: IGridRef,
  shiftKey?: boolean,
  ctrlKey?: boolean
): IAppThunk => (dispatch, getState) => {
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
      const sheetLocation = getDocumentOffsetPosition(sheet)

      const sheetAreaStart: IPosition = {
        x: sheetLocation.left,
        y: sheetLocation.top,
      }
      const sheetAreaEnd: IPosition = {
        x: sheetAreaStart.x + sheet.scrollWidth,
        y: sheetAreaStart.y + sheet.scrollHeight,
      }
      const sheetArea: IArea = { start: sheetAreaStart, end: sheetAreaEnd }

      // Bound the position - account for unexpected dimensions in react-window fork
      const {
        boundedPosition,
        scrollHorizontal,
        scrollVertical,
      } = boundPositionInOrderedArea(mousePosition, sheetArea)

      if (selectIsSelectionMode(state)) {
        const element = document.elementFromPoint(
          boundedPosition.x,
          boundedPosition.y
        )
        const { id: elementId } = element
        const [type, address] = elementId.split('=')

        let scopedPosition: IPosition | null = null

        switch (
          type as
            | 'cell'
            | 'row'
            | 'column'
            | 'root'
            | 'row_dragger'
            | 'column_dragger'
        ) {
          case 'cell':
            scopedPosition = JSON.parse(address)
            break
          case 'root':
          case 'column_dragger':
          case 'row_dragger':
          case 'column':
          case 'row': {
            const cellPosition = getEditableCellPositionFromBoundedPosition(
              boundedPosition,
              sheetArea
            )

            const cellElement = document.elementFromPoint(
              cellPosition.x,
              cellPosition.y
            )

            if (cellElement) {
              const { id: cellId } = cellElement

              const [, cellAddress] = cellId.split('=')
              scopedPosition = JSON.parse(cellAddress)
            }
            break
          }
          default:
            break
        }

        if (scopedPosition) {
          if (
            selectScrollHorizontal(state) !== scrollHorizontal ||
            selectScrollVertical(state) !== scrollVertical
          )
            dispatch(
              ExcelActions.UPDATE_SCROLL_EVENT({
                scrollHorizontal,
                scrollVertical,
              })
            )

          if (scrollVertical !== 'neutral' || scrollHorizontal !== 'neutral') {
            const scrollPosition: IPosition = { ...scopedPosition }

            switch (scrollHorizontal) {
              case 'left':
                scrollPosition.x -= 1
                scopedPosition.x = Math.max(scopedPosition.x - 2, 1)
                break
              case 'right':
                scopedPosition.x = Math.min(
                  scopedPosition.x + 1,
                  selectColumnCount(state)
                )
                break
              default:
                break
            }

            switch (scrollVertical) {
              case 'top':
                scrollPosition.y -= 1
                scopedPosition.y = Math.max(scopedPosition.y - 2, 1)
                break
              case 'bottom':
                scopedPosition.y = Math.min(
                  scopedPosition.y + 1,
                  selectRowCount(state)
                )
                break
              default:
                break
            }

            gridRef.current.scrollToItem({
              align: 'smart',
              rowIndex: scrollPosition.y,
              columnIndex: scrollPosition.x,
            })
          }

          if (
            !checkIsPositionEqualOtherPosition(
              selectLastVisitedCell(state),
              scopedPosition
            ) ||
            selectScrollHorizontal(state) !== scrollHorizontal ||
            selectScrollVertical(state) !== scrollVertical
          ) {
            dispatch(
              ctrlKey
                ? ExcelActions.CELL_MOUSE_ENTER_CTRL(scopedPosition)
                : ExcelActions.CELL_MOUSE_ENTER(scopedPosition)
            )
          }
        }
      } else if (selectIsRowDrag(state)) {
        const rowOffsets = selectRowOffsets(state)
        const dragRowIndex = selectDragRowIndex(state)
        const scrollOffsetY = selectScrollOffsetY(state)

        dispatch(
          ExcelActions.ROW_DRAG_MOVE(
            Math.max(
              rowOffsets[dragRowIndex] + 1,
              boundedPosition.y + scrollOffsetY - sheetAreaStart.y - 4
            )
          )
        )
      } else if (selectIsColumnDrag(state)) {
        const columnOffsets = selectColumnOffsets(state)
        const dragColumnIndex = selectDragColumnIndex(state)
        const scrollOffsetX = selectScrollOffsetX(state)
        dispatch(
          ExcelActions.COLUMN_DRAG_MOVE(
            Math.max(
              columnOffsets[dragColumnIndex] + 1,
              boundedPosition.x + scrollOffsetX - sheetAreaStart.x - 4
            )
          )
        )
      } else if (selectDragColumnIndex(state) || selectDragRowIndex(state)) {
        const element = document.elementFromPoint(
          boundedPosition.x,
          boundedPosition.y
        )
        const { id: elementId } = element
        const [type] = elementId.split('=')

        if (type !== 'row_dragger' && type !== 'column_dragger')
          dispatch(ExcelActions.CLEAN_STATE())
      }
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
  mousePosition: IPosition,
  shiftKey: boolean,
  ctrlKey: boolean
): IAppThunk => (dispatch, getState) => {
  const { id } = document.elementFromPoint(mousePosition.x, mousePosition.y)

  if (id) {
    const state = getState()
    const [type, address] = id.split('=')

    switch (type) {
      case 'cell': {
        const position: IPosition = JSON.parse(address)
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
}

export const THUNK_MOUSE_DOUBLE_CLICK = (
  mousePosition: IPosition
): IAppThunk => (dispatch) => {
  const { id } = document.elementFromPoint(mousePosition.x, mousePosition.y)

  if (id) {
    const [type] = id.split('=')

    switch (type) {
      case 'cell': {
        dispatch(ExcelActions.CELL_DOUBLE_CLICK())
        break
      }
      default:
        break
    }
  }
}
