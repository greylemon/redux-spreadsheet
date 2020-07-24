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
        }
      }
    },
    [dispatch, type]
  )

  return <div id={id} style={style} onMouseEnter={handleMouseEnter} />
}

export default HeaderDraggerArea
