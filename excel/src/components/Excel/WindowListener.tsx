import { useDispatch } from 'react-redux'
import { ExcelStore } from '../../redux/ExcelStore/store'
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
    if (selectionArea) dispatch(ExcelStore.actions.CELL_MOUSE_UP(selectionArea))
  }, [dispatch, selectionArea])

  window.onkeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEditMode) {
        const { ctrlKey, metaKey, key } = event

        if (ctrlKey || metaKey) {
          if (key === 'y') {
            handleRedo()
          } else if (key === 'z') {
            handleUndo()
          }
        } else if (key.length === 1) {
          dispatch(ExcelStore.actions.CELL_EDITOR_STATE_START())
        }
      }
    },
    [dispatch, isEditMode, handleUndo, handleRedo]
  )

  return null
}

export default WindowListener
