import React, { FunctionComponent, CSSProperties } from 'react'
import { shallowEqual } from 'react-redux'
import { ICommonPaneProps } from '../../@types/components'
import {
  selectSelectionAreaBottomLeftStyle,
  selectIsAreaInBottomLeftPane,
  selectSelectionAreaBottomRightStyle,
  selectSelectionAreaTopLeftStyle,
  selectIsAreaInTopLeftPane,
  selectSelectionAreaTopRightStyle,
  selectIsAreaInTopRightPane,
  selectIsAreaInBottomRightPane,
} from '../../redux/selectors/pane'
import { selectIsSelectionMode } from '../../redux/selectors/base'
import { useTypedSelector } from '../../redux/redux'

const SelectionArea: FunctionComponent<ICommonPaneProps> = ({ type }) => {
  const {
    isInCorrectPane,
    selectionAreaStyle,
    isSelectionMode,
  } = useTypedSelector((state) => {
    let selectionAreaStyle: CSSProperties
    let isInCorrectPane: boolean

    switch (type) {
      case 'BOTTOM_LEFT':
        selectionAreaStyle = selectSelectionAreaBottomLeftStyle(state)
        isInCorrectPane = selectIsAreaInBottomLeftPane(state)
        break
      case 'BOTTOM_RIGHT':
        selectionAreaStyle = selectSelectionAreaBottomRightStyle(state)
        isInCorrectPane = selectIsAreaInBottomRightPane(state)
        break
      case 'TOP_LEFT':
        selectionAreaStyle = selectSelectionAreaTopLeftStyle(state)
        isInCorrectPane = selectIsAreaInTopLeftPane(state)
        break
      case 'TOP_RIGHT':
        selectionAreaStyle = selectSelectionAreaTopRightStyle(state)
        isInCorrectPane = selectIsAreaInTopRightPane(state)
        break
      default:
        break
    }

    return {
      isInCorrectPane,
      isSelectionMode: selectIsSelectionMode(state),
      selectionAreaStyle,
    }
  }, shallowEqual)

  return isSelectionMode && isInCorrectPane ? (
    <div
      className="selectionArea selectionArea__active"
      style={selectionAreaStyle}
    />
  ) : (
    <></>
  )
}

export default SelectionArea
