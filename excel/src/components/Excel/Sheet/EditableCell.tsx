import React, { MouseEvent, FunctionComponent, Fragment } from 'react'
import { ICellProps } from '../../../@types/excel/components'
import { useDispatch } from 'react-redux'
import { ExcelActions } from '../../../redux/ExcelStore/store'
import {
  IRichText,
  IFragment,
  IRichTextBlock,
} from '../../../@types/excel/state'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

const RichTextFragment: FunctionComponent<IFragment> = ({
  text: value,
  styles,
}) => (
  <div className="richText__cell" style={styles}>
    {value}
  </div>
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

  const {
    data: sheetData,
    // columnWidthsAdjusted
  } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}

  const { value } = cellData

  const position = { x: columnIndex, y: rowIndex }

  const handleMouseDown = (event: MouseEvent) => {
    const { ctrlKey, shiftKey, buttons } = event

    if (buttons === 1) {
      if (ctrlKey) {
        dispatch(ExcelActions.CELL_MOUSE_DOWN_CTRL(position))
      } else if (shiftKey) {
        dispatch(ExcelActions.CELL_MOUSE_DOWN_SHIFT(position))
      } else {
        dispatch(ExcelActions.CELL_MOUSE_DOWN(position))
      }
    }
  }

  const handleMouseEnter = (event: MouseEvent) => {
    if (event.buttons === 1) {
      event.stopPropagation()
      dispatch(ExcelActions.CELL_MOUSE_ENTER(position))
    }
  }

  const adjustedStyle: CSSProperties = {
    ...style,
    // width: columnWidthsAdjusted[columnIndex],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  return (
    <div
      className={`unselectable cell ${value ? 'cell__editable' : ''}`}
      style={adjustedStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
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
