import React, {
  FunctionComponent,
  useCallback,
  CSSProperties,
  MouseEvent,
} from 'react'
import { useDispatch } from 'react-redux'
import {
  THUNK_MOUSE_ENTER_DRAG_ROW,
  THUNK_MOUSE_ENTER_DRAG_COLUMN,
} from '../../redux/thunks/mouse'
import { ExcelActions } from '../../redux/store'

const HeaderDraggerArea: FunctionComponent<{
  id: string
  type: 'row' | 'column'
  style: CSSProperties
  index: number
}> = ({ id, style, type, index }) => {
  const dispatch = useDispatch()

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      if (!event.buttons) {
        switch (type) {
          case 'row':
            dispatch(THUNK_MOUSE_ENTER_DRAG_ROW(index))
            break
          case 'column':
            dispatch(THUNK_MOUSE_ENTER_DRAG_COLUMN(index))
            break
          default:
            break
        }
      }
    },
    [dispatch, type]
  )

  const handleTouchStart = useCallback(() => {
    switch (type) {
      case 'column':
        dispatch(THUNK_MOUSE_ENTER_DRAG_COLUMN(index))
        dispatch(ExcelActions.COLUMN_DRAG_START())
        break
      case 'row':
        dispatch(THUNK_MOUSE_ENTER_DRAG_ROW(index))
        dispatch(ExcelActions.ROW_DRAG_START())
        break
      default:
        break
    }
  }, [dispatch, type, index])

  return (
    <div
      id={id}
      style={style}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
    />
  )
}

export default HeaderDraggerArea
