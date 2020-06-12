import React, { MouseEvent, FunctionComponent, Fragment } from 'react'
import { ICellProps } from '../../../@types/excel/components'
import { useDispatch } from 'react-redux'
import { ExcelStore } from '../../../redux/ExcelStore/store'
import {
  IRichText,
  IFragment,
  IRichTextBlock,
} from '../../../@types/excel/state'

const RichTextFragment: FunctionComponent<IFragment> = ({ value, styles }) => (
  <div style={styles}>{value}</div>
)

const RichTextBlock: FunctionComponent<IRichTextBlock> = ({ fragments }) => (
  <div className="richText__block">
    {fragments.map((data) => (
      <RichTextFragment {...data} />
    ))}
  </div>
)

const RichTextCellValue: FunctionComponent<{ value: IRichText }> = ({
  value,
}) => (
  <Fragment>
    {value.map((data) => (
      <RichTextBlock {...data} />
    ))}
  </Fragment>
)

const NormalCellValue: FunctionComponent<{ value?: string }> = ({ value }) => (
  <Fragment>{value}</Fragment>
)

const EditableCell = ({ style, data, columnIndex, rowIndex }: ICellProps) => {
  const dispatch = useDispatch()

  const { data: sheetData } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}

  const { value } = cellData

  const position = { x: columnIndex, y: rowIndex }

  const handleMouseDown = (event: MouseEvent) => {
    const { ctrlKey, shiftKey } = event

    if (ctrlKey) {
      dispatch(ExcelStore.actions.CELL_MOUSE_DOWN_CTRL(position))
    } else if (shiftKey) {
      dispatch(ExcelStore.actions.CELL_MOUSE_DOWN_SHIFT(position))
    } else {
      dispatch(ExcelStore.actions.CELL_MOUSE_DOWN(position))
    }
  }

  const handleMouseEnter = (event: MouseEvent) => {
    if (event.buttons === 1) {
      event.stopPropagation()
      dispatch(ExcelStore.actions.CELL_MOUSE_ENTER(position))
    }
  }

  const handleDoubleClick = () => {
    dispatch(ExcelStore.actions.CELL_DOUBLE_CLICK())
  }

  return (
    <div
      className="unselectable cell"
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onDoubleClick={handleDoubleClick}
    >
      {typeof value === 'object' ? (
        <RichTextCellValue value={value} />
      ) : (
        <NormalCellValue value={value} />
      )}
    </div>
  )
}

export default EditableCell
