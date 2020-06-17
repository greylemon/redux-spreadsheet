import React from 'react'
import { ISelectionAreaProps } from '../../../@types/excel/components'
import {
  selectSelectionArea,
  selectFactorySelectionAreaStyle,
} from '../../../redux/ExcelStore/selectors'
import { useTypedSelector } from '../../../redux/store'
import { shallowEqual } from 'react-redux'

const SelectionArea = ({ computeSelectionAreaStyle }: ISelectionAreaProps) => {
  const { selectionArea, selectionAreaStyle } = useTypedSelector(
    (state) => ({
      selectionArea: selectSelectionArea(state),
      selectionAreaStyle: selectFactorySelectionAreaStyle(
        computeSelectionAreaStyle
      )(state),
    }),
    shallowEqual
  )

  if (!selectionArea) return null

  return <div className="selectionArea__active" style={selectionAreaStyle} />
}

export default SelectionArea
