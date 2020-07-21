import React, { FunctionComponent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Undo, Redo } from '@material-ui/icons'
import { undo, redo } from 'undox'
import { SmallLabelButton } from '../misc/buttons'

const RedoAction: FunctionComponent = () => {
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(redo())
  }, [dispatch])

  return (
    <SmallLabelButton title="Redo (Ctrl+Y)" onClick={handleClick}>
      <Redo />
    </SmallLabelButton>
  )
}
const UndoAction: FunctionComponent = () => {
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch(undo())
  }, [dispatch])

  return (
    <SmallLabelButton title="Undo (Ctrl+Z)" onClick={handleClick}>
      <Undo />
    </SmallLabelButton>
  )
}

const HistorySection: FunctionComponent = () => (
  <div>
    <UndoAction />
    <RedoAction />
  </div>
)

export default HistorySection
