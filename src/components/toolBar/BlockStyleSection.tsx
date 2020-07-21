import React, { FunctionComponent } from 'react'
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
} from '@material-ui/icons'
import { shallowEqual } from 'react-redux'
import { SmallLabelButton } from '../misc/buttons'
import { useTypedSelector } from '../../redux/redux'
import {
  selectIsBold,
  selectIsItalic,
  selectIsStrikeThrough,
  selectIsUnderline,
} from '../../redux/selectors/style'

const UnderlineAction: FunctionComponent = () => {
  const isUnderline = useTypedSelector(
    (state) => selectIsUnderline(state),
    shallowEqual
  )

  return (
    <SmallLabelButton title="Underline (Ctrl+U)" isToggled={isUnderline}>
      <FormatUnderlined />
    </SmallLabelButton>
  )
}

const StrikethroughAction: FunctionComponent = () => {
  const isStrikethrough = useTypedSelector(
    (state) => selectIsStrikeThrough(state),
    shallowEqual
  )

  return (
    <SmallLabelButton title="Strikethrough" isToggled={isStrikethrough}>
      <FormatStrikethrough />
    </SmallLabelButton>
  )
}

const ItalicAction: FunctionComponent = () => {
  const isItalic = useTypedSelector(
    (state) => selectIsItalic(state),
    shallowEqual
  )

  return (
    <SmallLabelButton title="Italic (Ctrl+I)" isToggled={isItalic}>
      <FormatItalic />
    </SmallLabelButton>
  )
}

const BoldAction: FunctionComponent = () => {
  const isBold = useTypedSelector((state) => selectIsBold(state), shallowEqual)

  return (
    <SmallLabelButton title="Bold (Ctrl+B)" isToggled={isBold}>
      <FormatBold />
    </SmallLabelButton>
  )
}

const BlockStyleSection: FunctionComponent = () => (
  <div>
    <BoldAction />
    <ItalicAction />
    <StrikethroughAction />
    <UnderlineAction />
  </div>
)

export default BlockStyleSection
