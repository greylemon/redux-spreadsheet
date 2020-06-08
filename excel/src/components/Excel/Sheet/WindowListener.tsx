import { useDispatch } from 'react-redux'
import { ExcelStore } from '../../../redux/ExcelStore/store'
import { useTypedSelector } from '../../../redux'
import { selectSelectionArea } from '../../../redux/ExcelStore/selectors'

const WindowListener = () => {
  const dispatch = useDispatch()

  const selectionArea = useTypedSelector((state) => selectSelectionArea(state))

  window.onmouseup = () => {
    if (selectionArea) dispatch(ExcelStore.actions.CELL_MOUSE_UP(selectionArea))
  }

  return null
}

export default WindowListener
