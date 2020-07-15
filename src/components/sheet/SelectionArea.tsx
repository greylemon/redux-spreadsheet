import React, { Fragment, FunctionComponent, CSSProperties } from 'react'
import { ICommonPaneProps } from '../../@types/components'
import {
  selectSelectionArea,
  selectSelectionAreaBottomLeftStyle,
  selectIsAreaInBottomLeftPane,
  selectSelectionAreaBottomRightStyle,
  selectSelectionAreaTopLeftStyle,
  selectIsAreaInTopLeftPane,
  selectSelectionAreaTopRightStyle,
  selectIsAreaInTopRightPane,
  selectIsAreaInBottomRightPane,
} from '../../redux/selectors'
import { useTypedSelector } from '../../redux/redux'
import { shallowEqual } from 'react-redux'

const SelectionArea: FunctionComponent<ICommonPaneProps> = ({ type }) => {
  const {
    isInCorrectPane,
    selectionArea,
    selectionAreaStyle,
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
    }

    return {
      isInCorrectPane,
      selectionArea: selectSelectionArea(state),
      selectionAreaStyle,
    }
  }, shallowEqual)

  if (!selectionArea || !isInCorrectPane) return <Fragment />

  return (
    <div
      className="selectionArea selectionArea__active"
      style={selectionAreaStyle}
    />
  )
}

export default SelectionArea
