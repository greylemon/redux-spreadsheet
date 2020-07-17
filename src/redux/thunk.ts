import { convertRawExcelToState } from '../tools/parser'
import { IAppThunk } from '../@types/store'
import { ExcelActions } from './store'
import { IHandleSave } from '../@types/functions'
import {
  selectExcel,
  selectIsEditMode,
  selectSelectionArea,
  selectIsSelectionMode,
} from './selectors'
import { undo, redo } from 'undox'
import { IPosition, IArea } from '../@types/state'
import {
  boundPositionInOrderedArea,
  checkIsPositionEqualOtherPosition,
  getEditableCellPositionFromBoundedPosition,
} from '../tools'

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

  if (selectionArea) dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
}

export const customMouseMove = (
  mousePosition: IPosition,
  sheetArea: IArea
): IAppThunk => (dispatch, getState) => {
  const state = getState()

  const isSelectionMode = selectIsSelectionMode(state)

  if (!isSelectionMode) return

  // Bound the position
  const boundedPosition = boundPositionInOrderedArea(mousePosition, sheetArea)

  const element = document.elementFromPoint(
    boundedPosition.x,
    boundedPosition.y
  )
  const id = element.id
  const [type, address] = id.split('=')

  let scopedPosition: IPosition

  const selectionArea = selectSelectionArea(state)

  switch (type as 'cell' | 'row' | 'column' | 'root') {
    case 'cell':
      scopedPosition = JSON.parse(address)
      break
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
      const id = cellElement.id
      const [, cellAddress] = id.split('=')
      scopedPosition = JSON.parse(cellAddress)
      break
    }
    case 'root':
      scopedPosition = { x: 1, y: 1 }
  }

  if (!checkIsPositionEqualOtherPosition(selectionArea.end, scopedPosition)) {
    dispatch(dispatch(ExcelActions.CELL_MOUSE_ENTER(scopedPosition)))
  }
}
