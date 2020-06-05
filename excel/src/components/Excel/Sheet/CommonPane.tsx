import React, { Fragment } from 'react'

import ActiveCell from './ActiveCell'
// import ActiveSelectionArea from './ActiveSelectionArea'
// import StagnantSelectionAreas from './StagnantSelectionAreas'
import { ICommonPaneProps } from '../../../@types/excel/components'
import SelectionArea from './SelectionArea'

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
    {/* <StagnantSelectionAreas
      isRelevantArea={isRelevantArea}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    /> */}
  </Fragment>
)

export default CommonActivityPane
