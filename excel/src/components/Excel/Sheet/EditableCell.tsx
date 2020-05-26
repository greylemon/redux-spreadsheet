import React from 'react'
import { ICell } from '../../../@types/excel/components'

const EditableCell = ({ style }: ICell) => {
  return (
    <div className="unselectable" style={style}>
      edit
    </div>
  )
}

export default EditableCell
