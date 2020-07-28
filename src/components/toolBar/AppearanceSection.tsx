import React, { FunctionComponent } from 'react'
import { SettingsOverscan } from '@material-ui/icons'
import { selectIsMergable } from '../../redux/selectors/style'
import { THUNK_MERGE_AREA } from '../../redux/thunks/style'
import { GenericStyleButton } from './common'

const MergeAction: FunctionComponent = () => (
  <GenericStyleButton
    title="Merge"
    selectIsToggled={selectIsMergable}
    IconComponent={SettingsOverscan}
    thunk={THUNK_MERGE_AREA}
    disableOnOffToggle
  />
)

const AppearanceSection: FunctionComponent = () => (
  <div>
    <MergeAction />
  </div>
)

export default AppearanceSection
