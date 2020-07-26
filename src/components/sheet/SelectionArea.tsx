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
    let newSelectionAreaStyle: CSSProperties
    let newIsInCorrectPane: boolean

    switch (type) {
      case 'BOTTOM_LEFT':
        newSelectionAreaStyle = selectSelectionAreaBottomLeftStyle(state)
        newIsInCorrectPane = selectIsAreaInBottomLeftPane(state)
        break
      case 'BOTTOM_RIGHT':
        newSelectionAreaStyle = selectSelectionAreaBottomRightStyle(state)
        newIsInCorrectPane = selectIsAreaInBottomRightPane(state)
        break
      case 'TOP_LEFT':
        newSelectionAreaStyle = selectSelectionAreaTopLeftStyle(state)
        newIsInCorrectPane = selectIsAreaInTopLeftPane(state)
        break
      case 'TOP_RIGHT':
        newSelectionAreaStyle = selectSelectionAreaTopRightStyle(state)
        newIsInCorrectPane = selectIsAreaInTopRightPane(state)
        break
      default:
        break
    }

    return {
      isInCorrectPane: newIsInCorrectPane,
      isSelectionMode: selectIsSelectionMode(state),
      selectionAreaStyle: newSelectionAreaStyle,
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
