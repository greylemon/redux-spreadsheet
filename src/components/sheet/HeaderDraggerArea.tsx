import React, {
  FunctionComponent,
  useCallback,
  CSSProperties,
  MouseEvent,
} from 'react'
import { useDispatch } from 'react-redux'
import {
  mouseEnterDragRow,
  mouseOverDragColumn as mouseEnterDragColumn,
} from '../../redux/thunk'

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
            dispatch(mouseEnterDragRow(index))
            break
          case 'column':
            dispatch(mouseEnterDragColumn(index))
            break
        }
      }
    },
    [dispatch, type]
  )

  return <div id={id} style={style} onMouseEnter={handleMouseEnter} />
}

export default HeaderDraggerArea
