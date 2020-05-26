import React from 'react'
import { useTypedSelector } from '../../../store'

const EditorCell = () => {
  return <div />
}

const NormalCell = () => {
  return <div />
}

const ActiveCell = () => {
  const { isEditMode } = useTypedSelector(
    ({
      Excel: {
        present: { isEditMode },
      },
    }) => ({
      isEditMode,
    })
  )

  return isEditMode ? <EditorCell /> : <NormalCell />
}

export default ActiveCell
