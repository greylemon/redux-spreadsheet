import { useDispatch, shallowEqual } from 'react-redux'
import { ExcelActions } from '../redux/store'
import { useTypedSelector } from '../redux/redux'
import { selectIsEditMode } from '../redux/selectors'
import { useCallback, FunctionComponent } from 'react'
import { undo, redo } from 'undox'
import { IHandleSave } from '../@types/functions'
import { saveWorkbook } from '../redux/thunk'

const WindowKeyboardListener: FunctionComponent<{
  handleSave?: IHandleSave
}> = ({ handleSave }) => {
  const dispatch = useDispatch()

  const { isEditMode } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state),
    }),
    shallowEqual
  )

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch])

  const handleRedo = useCallback(() => dispatch(redo()), [dispatch])

  // Distinguish text submit from mouse move?
  window.onkeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEditMode) {
        const { ctrlKey, metaKey, shiftKey, key } = event

        if (ctrlKey || metaKey) {
          switch (key) {
            case 'y':
              handleRedo()
              break
            case 'z':
              handleUndo()
              break
            case 's':
              if (handleSave) dispatch(saveWorkbook(handleSave))
              event.preventDefault()
              break
            case 'a':
              dispatch(ExcelActions.SELECT_ALL())
              break
          }
        } else if (key.length === 1) {
          dispatch(ExcelActions.CELL_EDITOR_STATE_START())
        } else if (key === 'Delete') {
          dispatch(ExcelActions.CELL_KEY_DELETE())
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
    [dispatch, isEditMode, handleUndo, handleRedo, handleSave]
  )

  return null
}

export default WindowKeyboardListener
