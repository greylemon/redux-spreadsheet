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
    dispatch(ExcelActions.SET_UNDERLINE())
  }, [dispatch])

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
    dispatch(ExcelActions.SET_STRIKETHROUGH())
  }, [dispatch])

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
    dispatch(ExcelActions.SET_ITALIC())
  }, [dispatch])

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
    dispatch(ExcelActions.SET_BOLD())
  }, [dispatch])

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
