import React from 'react'
import { useTypedSelector } from '../../../store'
import { shallowEqual } from 'react-redux'
import { IActiveCell } from '../../../@types/excel/components'
import { selectIsEditMode } from '../../../store/ExcelStore/selectors'

const EditorCell = (props: IActiveCell) => {
  return <div />
}

const NormalCell = (props: IActiveCell) => {
  return <div />
}

const ActiveCell = () => {
  const { isEditMode } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state)
    }),
    shallowEqual
  )

  return isEditMode ? <EditorCell style={{}} /> : <NormalCell style={{}} />
}

export default ActiveCell
