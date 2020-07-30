import React, {
  FunctionComponent,
  useCallback,
  MouseEvent,
  CSSProperties,
} from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'

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
    let newStyle: CSSProperties = {}
    let newIsInCorrectPane = false

    switch (type) {
      case 'BOTTOM_LEFT':
        newIsInCorrectPane = selectIsDragRowOffsetInInBottomLeftPane(state)
        newStyle = selectRowDraggerBottomLeftStyle(state)
        break
      case 'TOP_LEFT':
        newIsInCorrectPane = selectIsDragRowOffsetInTopLeftPane(state)
        newStyle = selectRowDraggerStyle(state)
        break
      default:
        break
    }

    return { style: newStyle, isInCorrectPane: newIsInCorrectPane }
  }, shallowEqual)

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1) {
        dispatch(ExcelActions.ROW_DRAG_START())
      }
    },
    [dispatch]
  )

  return isInCorrectPane ? (
    <div id="row_dragger" style={style} onMouseDown={handleMouseDown} />
  ) : (
    <></>
  )
}

export default RowDragger
