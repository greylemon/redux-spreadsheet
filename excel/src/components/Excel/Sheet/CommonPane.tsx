import React, { Fragment } from 'react'

import ActiveCell from './ActiveCell'
// import ActiveSelectionArea from './ActiveSelectionArea'
// import StagnantSelectionAreas from './StagnantSelectionAreas'
import { ICommonPaneProps } from '../../../@types/excel/components'

const CommonActivityPane = ({
  computeActiveCellStyle,
  checkIsActiveCellInCorrectPane,
  checkIsRelevantArea,
}: ICommonPaneProps) => (
  <Fragment>
    <ActiveCell
      computeActiveCellStyle={computeActiveCellStyle}
      checkIsActiveCellInCorrectPane={checkIsActiveCellInCorrectPane}
    />
    {/* <ActiveSelectionArea
      isRelevantArea={isRelevantArea}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    />
    <StagnantSelectionAreas
      isRelevantArea={isRelevantArea}
      computeSelectionAreaStyle={computeSelectionAreaStyle}
    /> */}
  </Fragment>
)

export default CommonActivityPane
