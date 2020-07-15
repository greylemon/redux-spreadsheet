import { useDispatch, shallowEqual } from 'react-redux'
import { ExcelActions } from '../redux/store'
import { useTypedSelector } from '../redux/redux'
import { selectSelectionArea } from '../redux/selectors'
import { useCallback, FunctionComponent } from 'react'

const WindowMouseListener: FunctionComponent = () => {
  const dispatch = useDispatch()

  const { selectionArea } = useTypedSelector(
    (state) => ({
      selectionArea: selectSelectionArea(state),
    }),
    shallowEqual
  )

  window.onmouseup = useCallback(() => {
    if (selectionArea) dispatch(ExcelActions.CELL_MOUSE_UP(selectionArea))
  }, [dispatch, selectionArea])

  window.ondblclick = useCallback(() => {
    dispatch(ExcelActions.CELL_DOUBLE_CLICK())
  }, [dispatch])

  return null
}

export default WindowMouseListener
