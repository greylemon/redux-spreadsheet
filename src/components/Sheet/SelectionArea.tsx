import React, { Fragment, FunctionComponent } from 'react'
import { ISelectionAreaProps } from '../../@types/components'
import {
  selectSelectionArea,
  selectFactorySelectionAreaStyle,
  selectFreezeRowCount,
  selectFreezeColumnCount,
} from '../../redux/selectors'
import { useTypedSelector } from '../../redux/redux'
import { shallowEqual } from 'react-redux'

const SelectionArea: FunctionComponent<ISelectionAreaProps> = ({
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}) => {
  const {
    selectionArea,
    selectionAreaStyle,
    freezeColumnCount,
    freezeRowCount,
  } = useTypedSelector(
    (state) => ({
      selectionArea: selectSelectionArea(state),
      selectionAreaStyle: selectFactorySelectionAreaStyle(
        computeSelectionAreaStyle
      )(state),
      freezeColumnCount: selectFreezeColumnCount(state),
      freezeRowCount: selectFreezeRowCount(state),
    }),
    shallowEqual
  )

  if (
    !selectionArea ||
    !checkIsAreaInRelevantPane(freezeColumnCount, freezeRowCount, selectionArea)
  )
    return <Fragment />

  return <div className="selectionArea__active" style={selectionAreaStyle} />
}

export default SelectionArea
