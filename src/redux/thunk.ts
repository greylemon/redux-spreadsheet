import { undo, redo } from 'undox'
import { convertRawExcelToState } from '../tools/parser'
import { IAppThunk } from '../@types/store'
import { ExcelActions } from './store'
import { IHandleSave } from '../@types/functions'
import {
  selectExcel,
  selectIsEditMode,
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
} from './selectors/base'

import { IPosition, IArea, IRowIndex, IColumnIndex } from '../@types/state'
import {
  boundPositionInOrderedArea,
  checkIsPositionEqualOtherPosition,
  getEditableCellPositionFromBoundedPosition,
  denormalizeRowHeight,
  denormalizeColumnWidth,
} from '../tools'
import {
  selectRowOffsets,
  selectGetRowHeight,
  selectColumnOffsets,
  selectGetColumnWidth,
} from './selectors/custom'
import { getDocumentOffsetPosition } from '../tools/dom'
import {
  selectFreezeRowCount,
  selectFreezeColumnCount,
} from './selectors/activeSheet'

export const loadWorkbook = (file: File): IAppThunk => (dispatch) => {
  convertRawExcelToState(file).then((content) => {
    dispatch(ExcelActions.UPDATE_STATE(content))
  })
}

export const saveWorkbook = (handleSave: IHandleSave): IAppThunk => (
  _,
  getState
) => {
  handleSave(selectExcel(getState()))
}

export const customRedo = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(redo())
}

export const customUndo = (): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isEditMode = selectIsEditMode(state)

  if (isEditMode) return

  dispatch(undo())
}

export const customMouseUp = (): IAppThunk => (dispatch, getState) => {
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

    dispatch(ExcelActions.ROW_DRAG_END(denormalizeRowHeight(value)))
  } else if (isColumnDrag) {
    const columnOffsets = selectColumnOffsets(state)
    const dragColumnIndex = selectDragColumnIndex(state)
    const dragColumnOffset = selectDragColumnOffset(state)
    const scrollOffsetX = selectScrollOffsetX(state)
    const freezeColumnCount = selectFreezeColumnCount(state)

    let value = dragColumnOffset - columnOffsets[dragColumnIndex]

    if (dragColumnIndex <= freezeColumnCount) value -= scrollOffsetX
    dispatch(ExcelActions.COLUMN_DRAG_END(denormalizeColumnWidth(value)))
  }
}

export const customMouseMove = (mousePosition: IPosition): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()

  const freezeColumnCount = selectFreezeColumnCount(state)
  const freezeRowCount = selectFreezeRowCount(state)

  const sheet = document.getElementById('sheet')
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
  const boundedPosition = boundPositionInOrderedArea(
    mousePosition,
    sheetArea,
    freezeRowCount ? -2 : -1,
    freezeColumnCount ? -2 : -1
  )

  if (selectIsSelectionMode(state)) {
    const element = document.elementFromPoint(
      boundedPosition.x,
      boundedPosition.y
    )
    const { id } = element
    const [type, address] = id.split('=')

    let scopedPosition: IPosition

    const selectionArea = selectSelectionArea(state)

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
          const { id } = cellElement
          const [, cellAddress] = id.split('=')
          scopedPosition = JSON.parse(cellAddress)
        }
        break
      }
      case 'root':
        scopedPosition = { x: 1, y: 1 }
        break
    }

    if (
      scopedPosition &&
      !checkIsPositionEqualOtherPosition(selectionArea.end, scopedPosition)
    ) {
      dispatch(dispatch(ExcelActions.CELL_MOUSE_ENTER(scopedPosition)))
    }
  } else if (selectIsRowDrag(state)) {
    const rowOffsets = selectRowOffsets(state)
    const dragRowIndex = selectDragRowIndex(state)
    const scrollOffsetY = selectScrollOffsetY(state)

    dispatch(
      ExcelActions.ROW_DRAG_MOVE(
        Math.max(
          rowOffsets[dragRowIndex] + 3,
          boundedPosition.y + scrollOffsetY - sheetAreaStart.y
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
          columnOffsets[dragColumnIndex] + 3,
          boundedPosition.x + scrollOffsetX - sheetAreaStart.x
        )
      )
    )
  }
}

export const mouseEnterDragRow = (rowIndex: IRowIndex): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const rowOffsets = selectRowOffsets(state)
  const rowHeightGetter = selectGetRowHeight(state)

  dispatch(
    ExcelActions.ROW_DRAG_ENTER({
      dragRowIndex: rowIndex,
      dragRowOffset: rowOffsets[rowIndex] + rowHeightGetter(rowIndex) - 2,
    })
  )
}

export const mouseEnterDragColumn = (columnIndex: IColumnIndex): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const columnOffsets = selectColumnOffsets(state)
  const columnWidthGetter = selectGetColumnWidth(state)

  dispatch(
    ExcelActions.COLUMN_DRAG_ENTER({
      dragColumnIndex: columnIndex,
      dragColumnOffset:
        columnOffsets[columnIndex] + columnWidthGetter(columnIndex) - 2,
    })
  )
}
