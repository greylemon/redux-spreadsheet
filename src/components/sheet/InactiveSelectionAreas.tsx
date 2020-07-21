import React, { FunctionComponent, CSSProperties } from 'react'
import { shallowEqual } from 'react-redux'
import { ICommonPaneProps } from '../../@types/components'
import { useTypedSelector } from '../../redux/redux'
import {
  selectInactiveSelectionAreasBottomLeftStyle,
  selectInactiveSelectionAreasBottomRightStyle,
  selectInactiveSelectionAreasTopLeftStyle,
  selectInactiveSelectionAreasTopRightStyle,
} from '../../redux/selectors/pane'

const InactiveSelectionAreas: FunctionComponent<ICommonPaneProps> = ({
  type,
}) => {
  const inactiveSelectionAreasStyle = useTypedSelector((state) => {
    let inactiveSelectionAreasStyle: CSSProperties[]

    switch (type) {
      case 'BOTTOM_LEFT':
        inactiveSelectionAreasStyle = selectInactiveSelectionAreasBottomLeftStyle(
          state
        )
        break
      case 'BOTTOM_RIGHT':
        inactiveSelectionAreasStyle = selectInactiveSelectionAreasBottomRightStyle(
          state
        )
        break
      case 'TOP_LEFT':
        inactiveSelectionAreasStyle = selectInactiveSelectionAreasTopLeftStyle(
          state
        )
        break
      case 'TOP_RIGHT':
        inactiveSelectionAreasStyle = selectInactiveSelectionAreasTopRightStyle(
          state
        )
        break
    }

    return inactiveSelectionAreasStyle
  }, shallowEqual)

  return (
    <>
      {inactiveSelectionAreasStyle.map((inactiveSelectionAreaStyle, index) => (
        <div
          key={`inactive-selection-area-${index}`}
          className="selectionArea selectionArea__inactive"
          style={inactiveSelectionAreaStyle}
        />
      ))}
    </>
  )
}

export default InactiveSelectionAreas
