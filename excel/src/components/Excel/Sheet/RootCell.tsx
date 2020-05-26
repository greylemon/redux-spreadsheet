import React from 'react'
import { ICell } from '../../../@types/excel/components'

const RootCell = ({ style }: ICell) => {
  return <div className="unselectable cell cell__header" style={style} />
}

export default RootCell
