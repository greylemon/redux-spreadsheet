import React, { FunctionComponent, useCallback, MouseEvent } from 'react'
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
} from '@material-ui/icons'
import { shallowEqual, useDispatch } from 'react-redux'
import { SmallLabelButton } from '../misc/buttons'
import { useTypedSelector } from '../../redux/redux'
import {
  selectIsBold,
  selectIsItalic,
  selectIsStrikeThrough,
  selectIsUnderline,
} from '../../redux/selectors/style'
import {
  THUNK_TOGGLE_UNDERLINE,
  THUNK_TOGGLE_STRIKETHROUGH,
  THUNK_TOGGLE_ITALIC,
  THUNK_TOGGLE_BOLD,
} from '../../redux/thunks/style'
import IRootStore, { IAppThunk } from '../../@types/store'

const GenericStyleButton: FunctionComponent<{
  selectIsToggled: (rootStore: IRootStore) => boolean
  title: string
  IconComponent: FunctionComponent
  thunk: () => IAppThunk
}> = ({ title, selectIsToggled, IconComponent, thunk }) => {
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
    >
      <IconComponent />
    </SmallLabelButton>
  )
}

const UnderlineAction: FunctionComponent = () => (
  <GenericStyleButton
    title="Underline (Ctrl+U)"
    selectIsToggled={selectIsUnderline}
    IconComponent={FormatUnderlined}
    thunk={THUNK_TOGGLE_UNDERLINE}
  />
)

const StrikethroughAction: FunctionComponent = () => (
  <GenericStyleButton
    title="Strikethrough"
    selectIsToggled={selectIsStrikeThrough}
    IconComponent={FormatStrikethrough}
    thunk={THUNK_TOGGLE_STRIKETHROUGH}
  />
)

const ItalicAction: FunctionComponent = () => (
  <GenericStyleButton
    title="Italic (Ctrl+I)"
    selectIsToggled={selectIsItalic}
    IconComponent={FormatItalic}
    thunk={THUNK_TOGGLE_ITALIC}
  />
)

const BoldAction: FunctionComponent = () => (
  <GenericStyleButton
    title="Bold (Ctrl+B)"
    selectIsToggled={selectIsBold}
    IconComponent={FormatBold}
    thunk={THUNK_TOGGLE_BOLD}
  />
)

const BlockStyleSection: FunctionComponent = () => (
  <div>
    <BoldAction />
    <ItalicAction />
    <StrikethroughAction />
    <UnderlineAction />
  </div>
)

export default BlockStyleSection
