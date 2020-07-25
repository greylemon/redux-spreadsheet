import React, { FunctionComponent, useCallback } from 'react'
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
import { ExcelActions } from '../../redux/store'

const UnderlineAction: FunctionComponent = () => {
  const isUnderline = useTypedSelector(
    (state) => selectIsUnderline(state),
    shallowEqual
  )

  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(
      isUnderline
        ? ExcelActions.UNSET_UNDERLINE()
        : ExcelActions.SET_UNDERLINE()
    )
  }, [dispatch, isUnderline])

  return (
    <SmallLabelButton
      title="Underline (Ctrl+U)"
      isToggled={isUnderline}
      onClick={handleClick}
    >
      <FormatUnderlined />
    </SmallLabelButton>
  )
}

const StrikethroughAction: FunctionComponent = () => {
  const isStrikethrough = useTypedSelector(
    (state) => selectIsStrikeThrough(state),
    shallowEqual
  )

  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(
      isStrikethrough
        ? ExcelActions.UNSET_STRIKETHROUGH()
        : ExcelActions.SET_STRIKETHROUGH()
    )
  }, [dispatch, isStrikethrough])

  return (
    <SmallLabelButton
      title="Strikethrough"
      isToggled={isStrikethrough}
      onClick={handleClick}
    >
      <FormatStrikethrough />
    </SmallLabelButton>
  )
}

const ItalicAction: FunctionComponent = () => {
  const isItalic = useTypedSelector(
    (state) => selectIsItalic(state),
    shallowEqual
  )

  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(isItalic ? ExcelActions.UNSET_ITALIC() : ExcelActions.SET_ITALIC())
  }, [dispatch, isItalic])

  return (
    <SmallLabelButton
      title="Italic (Ctrl+I)"
      isToggled={isItalic}
      onClick={handleClick}
    >
      <FormatItalic />
    </SmallLabelButton>
  )
}

const BoldAction: FunctionComponent = () => {
  const isBold = useTypedSelector((state) => selectIsBold(state), shallowEqual)
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(isBold ? ExcelActions.UNSET_BOLD() : ExcelActions.SET_BOLD())
  }, [dispatch, isBold])

  return (
    <SmallLabelButton
      title="Bold (Ctrl+B)"
      isToggled={isBold}
      onClick={handleClick}
    >
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
