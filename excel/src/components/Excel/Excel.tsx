import React, { KeyboardEvent } from 'react'
import Sheet from './Sheet'

// import './styles/styles.scss'
import './styles/styles.scss'
import { useDispatch } from 'react-redux'
import { undo, redo } from 'undox'

const Excel = () => {
  const dispatch = useDispatch()
  const handleUndo = () => dispatch(undo())

  const handleRedo = () => dispatch(redo())

  const handlekeyDown = (event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key } = event

    if (ctrlKey || metaKey) {
      if (key === 'y') {
        handleRedo()
      } else if (key === 'z') {
        handleUndo()
      }
    }
  }

  return (
    <div className="view" tabIndex={-1} onKeyDown={handlekeyDown}>
      <Sheet />
    </div>
  )
}

export default Excel
