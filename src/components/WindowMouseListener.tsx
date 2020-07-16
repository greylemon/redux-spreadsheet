import { useDispatch, shallowEqual } from 'react-redux'
import { ExcelActions } from '../redux/store'
import { useTypedSelector } from '../redux/redux'
import { selectSelectionArea } from '../redux/selectors'
import { useCallback, FunctionComponent } from 'react'

const WindowMouseListener: FunctionComponent = () => {
  const dispatch = useDispatch()

  const selectionArea = useTypedSelector(
    (state) => selectSelectionArea(state),
    shallowEqual
  )

  window.onmouseup = useCallback(() => {
    if (selectionArea) dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
  }, [dispatch, selectionArea])

  return null
}

export default WindowMouseListener
