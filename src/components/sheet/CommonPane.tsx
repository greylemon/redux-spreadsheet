import React, { Fragment, FunctionComponent } from 'react'

import ActiveCell from './ActiveCell'
import { ICommonPaneProps } from '../../@types/components'
import SelectionArea from './SelectionArea'
import InactiveSelectionAreas from './InactiveSelectionAreas'
import RowDragger from './RowDragger'
import ColumnDragger from './ColumnDragger'

const CommonActivityPane: FunctionComponent<ICommonPaneProps> = ({ type }) => (
  <Fragment>
    <ActiveCell type={type} />
    <SelectionArea type={type} />
    <InactiveSelectionAreas type={type} />
    {(type === 'TOP_LEFT' || type === 'BOTTOM_LEFT') && (
      <RowDragger type={type} />
    )}
    {(type === 'TOP_LEFT' || type === 'TOP_RIGHT') && (
      <ColumnDragger type={type} />
    )}
  </Fragment>
)

export default CommonActivityPane
