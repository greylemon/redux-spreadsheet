import React, { FunctionComponent, useCallback, MouseEvent } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { SmallLabelButton } from '../misc/buttons'
import { useTypedSelector } from '../../redux/redux'
import IRootStore, { IAppThunk } from '../../@types/store'

export const GenericStyleButton: FunctionComponent<{
  selectIsToggled: (rootStore: IRootStore) => boolean
  title: string
  IconComponent: FunctionComponent
  thunk: () => IAppThunk
  disableOnOffToggle?: boolean
}> = ({ title, selectIsToggled, IconComponent, thunk, disableOnOffToggle }) => {
  const dispatch = useDispatch()
  const isToggled = useTypedSelector(
    (state) => selectIsToggled(state),
    shallowEqual
  )

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
    },
    [dispatch]
  )

  const handleClick = useCallback(() => {
    dispatch(thunk())
  }, [dispatch])

  return (
    <SmallLabelButton
      title={title}
      isToggled={isToggled}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      disabled={disableOnOffToggle && !isToggled}
    >
      <IconComponent />
    </SmallLabelButton>
  )
}
