import React, {
  FunctionComponent,
  useCallback,
  MouseEvent,
  Fragment,
} from 'react'
import { useTypedSelector } from '../../redux/redux'

import { shallowEqual, useDispatch } from 'react-redux'
import { ICommonPaneProps } from '../../@types/components'
import { ExcelActions } from '../../redux/store'
import {
  selectIsDragColumnOffsetInTopLeftPane,
  selectIsDragColumnOffsetInInTopRightPane,
} from '../../redux/selectors/pane'
import { selectColumnDraggerStyle } from '../../redux/selectors/custom'

const ColumnDragger: FunctionComponent<ICommonPaneProps> = ({ type }) => {
  const dispatch = useDispatch()

  const { style, isInCorrectPane } = useTypedSelector((state) => {
    const style = selectColumnDraggerStyle(state)
    let isInCorrectPane = false

    switch (type) {
      case 'TOP_LEFT':
        isInCorrectPane = selectIsDragColumnOffsetInTopLeftPane(state)
        break
      case 'TOP_RIGHT':
        isInCorrectPane = selectIsDragColumnOffsetInInTopRightPane(state)
        break
    }

    return { style, isInCorrectPane }
  }, shallowEqual)

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1) {
        dispatch(ExcelActions.COLUMN_DRAG_START())
      }
    },
    [dispatch]
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      if (!event.buttons) dispatch(ExcelActions.COLUMN_DRAG_LEAVE())
    },
    [dispatch]
  )

  return isInCorrectPane ? (
    <div
      style={style}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    />
  ) : (
    <Fragment />
  )
}

export default ColumnDragger
