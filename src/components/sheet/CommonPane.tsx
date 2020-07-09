import React, { Fragment, FunctionComponent } from 'react'

import ActiveCell from './ActiveCell'
import { ICommonPaneProps } from '../../@types/components'
import SelectionArea from './SelectionArea'
import InactiveSelectionAreas from './InactiveSelectionAreas'

const CommonActivityPane: FunctionComponent<ICommonPaneProps> = ({
  computeActiveCellStyle,
  checkIsActiveCellInCorrectPane,
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}) => (
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
