import React from 'react'
import { ISelectionAreaProps } from '../../../@types/excel/components'
import { selectSelectionArea, selectFactorySelectionAreaStyle, selectIsActiveCellPositionEqualSelectionArea } from '../../../redux/ExcelStore/selectors'
import { useTypedSelector } from '../../../redux'

const SelectionArea = ({ computeSelectionAreaStyle }: ISelectionAreaProps) => {
  const { selectionArea, selectionAreaStyle, isActiveCellPositionEqualSelectionArea } = useTypedSelector(
    (state) => ({
      selectionArea: selectSelectionArea(state),
      selectionAreaStyle: selectFactorySelectionAreaStyle(computeSelectionAreaStyle)(state),
      isActiveCellPositionEqualSelectionArea: selectIsActiveCellPositionEqualSelectionArea(state)
    })
  )

  if(!selectionArea || isActiveCellPositionEqualSelectionArea) return null

  return <div className="selectionArea" style={selectionAreaStyle}/>
}

export default SelectionArea