import React from 'react'
import { ISelectionAreaProps } from '../../../@types/excel/components'
import {
  selectSelectionArea,
  selectFactorySelectionAreaStyle,
} from '../../../redux/ExcelStore/selectors'
import { useTypedSelector } from '../../../redux/store'

const SelectionArea = ({ computeSelectionAreaStyle }: ISelectionAreaProps) => {
  const { selectionArea, selectionAreaStyle } = useTypedSelector((state) => ({
    selectionArea: selectSelectionArea(state),
    selectionAreaStyle: selectFactorySelectionAreaStyle(
      computeSelectionAreaStyle
    )(state),
  }))

  if (!selectionArea) return null

  return <div className="selectionArea__active" style={selectionAreaStyle} />
}

export default SelectionArea
