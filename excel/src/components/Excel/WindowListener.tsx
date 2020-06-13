import { useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/ExcelStore/store'
import { useTypedSelector } from '../../redux/store'
import {
  selectSelectionArea,
  selectIsEditMode,
} from '../../redux/ExcelStore/selectors'
import { useCallback } from 'react'
import { undo, redo } from 'undox'

const WindowListener = () => {
  const dispatch = useDispatch()

  const { selectionArea, isEditMode } = useTypedSelector((state) => ({
    selectionArea: selectSelectionArea(state),
    isEditMode: selectIsEditMode(state),
  }))

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch])

  const handleRedo = useCallback(() => dispatch(redo()), [dispatch])

  window.onmouseup = useCallback(() => {
    if (selectionArea) dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
  }, [dispatch, selectionArea])

  // Distinguish text submit from mouse move?
  window.onkeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEditMode) {
        const { ctrlKey, metaKey, shiftKey, key } = event

        if (ctrlKey || metaKey) {
          if (key === 'y') {
            handleRedo()
          } else if (key === 'z') {
            handleUndo()
          }
        } else if (key.length === 1) {
          dispatch(ExcelActions.CELL_EDITOR_STATE_START())
        } else {
          if (shiftKey) {
            // TODO
            return
          } else {
            switch (key) {
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
            }
          }
        }
      }
    },
    [dispatch, isEditMode, handleUndo, handleRedo]
  )

  window.ondblclick = useCallback(() => {
    dispatch(ExcelActions.CELL_DOUBLE_CLICK())
  }, [dispatch])

  return null
}

export default WindowListener
