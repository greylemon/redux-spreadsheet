import React, {
  FunctionComponent,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react'
import {
  TextField,
  // ClickAwayListener
} from '@material-ui/core'
import { shallowEqual, useDispatch } from 'react-redux'
import { STYLE_APP_BAR_TEXT_FIELD_INPUT } from './style'
import { useTypedSelector } from '../../redux/redux'
import { selectName } from '../../redux/selectors/base'

const AppBarName: FunctionComponent = () => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLInputElement>()
  const name = useTypedSelector((state) => selectName(state), shallowEqual)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event

      switch (key) {
        case 'Enter':
          // console.log('blur')
          ref.current.blur()
          break
        case 'Escape':
          break
        default:
          break
      }
    },
    [dispatch]
  )

  // const handleClickAway = useCallback()

  return (
    <TextField
      inputRef={ref}
      onKeyDown={handleKeyDown}
      value={name}
      InputProps={{ style: STYLE_APP_BAR_TEXT_FIELD_INPUT }}
      variant="outlined"
    />
  )
}

export default AppBarName
