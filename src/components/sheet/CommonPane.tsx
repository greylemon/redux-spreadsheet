import React, { Fragment, FunctionComponent } from 'react'

import ActiveCell from './ActiveCell'
import { ICommonPaneProps } from '../../@types/components'
import SelectionArea from './SelectionArea'
import InactiveSelectionAreas from './InactiveSelectionAreas'

const CommonActivityPane: FunctionComponent<ICommonPaneProps> = ({ type }) => (
  <Fragment>
    <ActiveCell type={type} />
    <SelectionArea type={type} />
    <InactiveSelectionAreas type={type} />
  </Fragment>
)

export default CommonActivityPane
