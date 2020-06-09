import { useDispatch } from 'react-redux'
import { ExcelStore } from '../../../redux/ExcelStore/store'
import { useTypedSelector } from '../../../redux'
import {
  selectSelectionArea,
  selectIsEditMode,
} from '../../../redux/ExcelStore/selectors'
import { useCallback } from 'react'
import { ASCIIRegex } from '../tools/regex'

const WindowListener = () => {
  const dispatch = useDispatch()

  const { selectionArea, isEditMode } = useTypedSelector((state) => ({
    selectionArea: selectSelectionArea(state),
    isEditMode: selectIsEditMode(state),
  }))

  window.onmouseup = useCallback(() => {
    if (selectionArea) dispatch(ExcelStore.actions.CELL_MOUSE_UP(selectionArea))
  }, [dispatch, selectionArea])

  window.onkeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEditMode) {
        const { key } = event

        if (key.length === 1)
          dispatch(ExcelStore.actions.CELL_EDITOR_STATE_START())
      }
    },
    [dispatch, isEditMode]
  )

  return null
}

export default WindowListener
