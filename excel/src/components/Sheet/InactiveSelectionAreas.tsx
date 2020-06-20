import React, { Fragment } from 'react'
import { IInactiveSelectionAreasProps } from '../../@types/excel/components'
import { useTypedSelector } from '../../redux/store'
import { selectFactoryInactiveSelectionAreasStyle } from '../../redux/ExcelStore/selectors'
import { shallowEqual } from 'react-redux'

const InactiveSelectionAreas = ({
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}: IInactiveSelectionAreasProps) => {
  const inactiveSelectionAreasStyle = useTypedSelector(
    (state) =>
      selectFactoryInactiveSelectionAreasStyle(
        computeSelectionAreaStyle,
        checkIsAreaInRelevantPane
      )(state),
    shallowEqual
  )

  return (
    <Fragment>
      {inactiveSelectionAreasStyle.map((inactiveSelectionAreaStyle, index) => (
        <div
          key={`inactive-selection-area-${index}`}
          className="selectionArea__inactive"
          style={inactiveSelectionAreaStyle}
        />
      ))}
    </Fragment>
  )
}

export default InactiveSelectionAreas
