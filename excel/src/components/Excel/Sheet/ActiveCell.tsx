import React from 'react'
import { useTypedSelector } from '../../../store'
import { shallowEqual } from 'react-redux'
import { IActiveCell } from '../../../@types/excel/components'

const EditorCell = (props: IActiveCell) => {
  return <div />
}

const NormalCell = (props: IActiveCell) => {
  return <div />
}

const ActiveCell = () => {
  const { isEditMode } = useTypedSelector(
    ({ Excel: { present } }) => ({
      isEditMode: present.isEditMode,
    }),
    shallowEqual
  )

  return isEditMode ? <EditorCell style={{}} /> : <NormalCell style={{}} />
}

export default ActiveCell
