import React, {
  FunctionComponent,
  useCallback,
  MouseEvent,
  Fragment,
  CSSProperties,
} from 'react'
import { useTypedSelector } from '../../redux/redux'

import { shallowEqual, useDispatch } from 'react-redux'
import { selectRowDraggerStyle } from '../../redux/selectors/custom'
import { ICommonPaneProps } from '../../@types/components'
import { ExcelActions } from '../../redux/store'
import {
  selectIsDragRowOffsetInInBottomLeftPane,
  selectIsDragRowOffsetInTopLeftPane,
  selectRowDraggerBottomLeftStyle,
} from '../../redux/selectors/pane'

const RowDragger: FunctionComponent<ICommonPaneProps> = ({ type }) => {
  const dispatch = useDispatch()
  const { style, isInCorrectPane } = useTypedSelector((state) => {
    let style: CSSProperties = {}
    let isInCorrectPane = false

    switch (type) {
      case 'BOTTOM_LEFT':
        isInCorrectPane = selectIsDragRowOffsetInInBottomLeftPane(state)
        style = selectRowDraggerBottomLeftStyle(state)
        break
      case 'TOP_LEFT':
        isInCorrectPane = selectIsDragRowOffsetInTopLeftPane(state)
        style = selectRowDraggerStyle(state)
        break
    }

    return { style, isInCorrectPane }
  }, shallowEqual)

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1) {
        dispatch(ExcelActions.ROW_DRAG_START())
      }
    },
    [dispatch]
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      if (!event.buttons) dispatch(ExcelActions.ROW_DRAG_LEAVE())
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

export default RowDragger
