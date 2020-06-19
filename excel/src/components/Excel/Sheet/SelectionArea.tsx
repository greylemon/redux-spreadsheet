import React, { Fragment } from 'react'
import { ISelectionAreaProps } from '../../../@types/excel/components'
import {
  selectSelectionArea,
  selectFactorySelectionAreaStyle,
  selectFreezeRowCount,
  selectFreezeColumnCount,
} from '../../../redux/ExcelStore/selectors'
import { useTypedSelector } from '../../../redux/store'
import { shallowEqual } from 'react-redux'

const SelectionArea = ({
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}: ISelectionAreaProps) => {
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
