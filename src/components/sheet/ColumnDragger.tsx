import React, { FunctionComponent, useCallback, MouseEvent } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'

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
    const newStyle = selectColumnDraggerStyle(state)
    let newIsInCorrectPane = false

    switch (type) {
      case 'TOP_LEFT':
        newIsInCorrectPane = selectIsDragColumnOffsetInTopLeftPane(state)
        break
      case 'TOP_RIGHT':
        newIsInCorrectPane = selectIsDragColumnOffsetInInTopRightPane(state)
        break
      default:
        break
    }

    return { style: newStyle, isInCorrectPane: newIsInCorrectPane }
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
    <></>
  )
}

export default ColumnDragger
