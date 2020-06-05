import React, { Fragment } from 'react'

import ActiveCell from './ActiveCell'
// import ActiveSelectionArea from './ActiveSelectionArea'
// import StagnantSelectionAreas from './StagnantSelectionAreas'
import { ICommonPaneProps } from '../../../@types/excel/components'
import SelectionArea from './SelectionArea'
import InactiveSelectionAreas from './InactiveSelectionAreas'

const CommonActivityPane = ({
  computeActiveCellStyle,
  checkIsActiveCellInCorrectPane,
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}: ICommonPaneProps) => (
  <Fragment>
    <ActiveCell
      computeActiveCellStyle={computeActiveCellStyle}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
    />
    <SelectionArea
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    />
    <InactiveSelectionAreas
      checkIsAreaInRelevantPane={checkIsAreaInRelevantPane}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    />
  </Fragment>
)

export default CommonActivityPane
