import React from 'react'
import { useTypedSelector } from '../../../redux'
import { shallowEqual } from 'react-redux'
import {
  IActiveCellProps,
  INormalActiveCellProps,
  IEditorCellProps,
} from '../../../@types/excel/components'
import {
  selectIsEditMode,
  selectFactoryActiveCellStyle,
} from '../../../redux/ExcelStore/selectors'

const EditorCell = ({ style }: IEditorCellProps) => {
  return <div className="cell__active" style={style} />
}

const NormalActiveCell = ({ style }: INormalActiveCellProps) => {
  return <div className="cell__active" style={style} />
}

const ActiveCell = ({ computeActiveCellStyle }: IActiveCellProps) => {
  const { isEditMode, style } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state),
      style: selectFactoryActiveCellStyle(computeActiveCellStyle)(state),
    }),
    shallowEqual
  )

  return isEditMode ? (
    <EditorCell style={style} />
  ) : (
    <NormalActiveCell style={style} />
  )
}

export default ActiveCell
