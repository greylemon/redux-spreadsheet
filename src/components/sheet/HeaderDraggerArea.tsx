import React, {
  FunctionComponent,
  useCallback,
  CSSProperties,
  MouseEvent,
} from 'react'
import { useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/store'

const HeaderDraggerArea: FunctionComponent<{
  id: string
  type: 'row' | 'column'
  style: CSSProperties
  index: number
}> = ({ id, style, type, index }) => {
  const dispatch = useDispatch()

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1) {
        switch (type) {
          case 'row':
            dispatch(ExcelActions.ROW_DRAG_START(index))
            break
          case 'column':
            dispatch(ExcelActions.COLUMN_DRAG_START(index))
            break
        }
      }
    },
    [dispatch, type, index]
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      if (!event.buttons) {
        switch (type) {
          case 'row':
            dispatch(ExcelActions.ROW_DRAG_LEAVE())
            break
          case 'column':
            dispatch(ExcelActions.COLUMN_DRAG_LEAVE())
            break
        }
      }
    },
    [dispatch, type]
  )

  return (
    <div
      id={id}
      style={style}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    />
  )
}

export default HeaderDraggerArea
