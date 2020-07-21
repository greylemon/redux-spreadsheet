import React, { FunctionComponent, useCallback } from 'react'
import { SettingsOverscan } from '@material-ui/icons'
import { shallowEqual, useDispatch } from 'react-redux'
import { SmallLabelButton } from '../misc/buttons'
import { useTypedSelector } from '../../redux/redux'
import { selectIsMergable } from '../../redux/selectors/style'
import { ExcelActions } from '../../redux/store'

const MergeAction: FunctionComponent = () => {
  const dispatch = useDispatch()
  const isMergable = useTypedSelector(
    (state) => selectIsMergable(state),
    shallowEqual
  )

  const handleClick = useCallback(() => {
    dispatch(ExcelActions.MERGE_AREA())
  }, [dispatch])

  return (
    <SmallLabelButton
      title="Merge"
      disabled={!isMergable}
      onClick={handleClick}
    >
      <SettingsOverscan />
    </SmallLabelButton>
  )
}

const AppearanceSection: FunctionComponent = () => (
  <div>
    <MergeAction />
  </div>
)

export default AppearanceSection
