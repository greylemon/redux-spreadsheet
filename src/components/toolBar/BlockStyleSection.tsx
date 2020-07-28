import React, { FunctionComponent } from 'react'
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatUnderlined,
} from '@material-ui/icons'
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
import { GenericStyleButton } from './common'

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
