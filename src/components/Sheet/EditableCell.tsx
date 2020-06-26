import React, { MouseEvent, FunctionComponent, Fragment, useMemo } from 'react'
import { ICellProps } from '../../@types/components'
import { useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/store'
import {
  IRichTextValue,
  IFragment,
  IRichTextBlock,
  IFormulaValue,
} from '../../@types/state'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
} from '../../constants/cellTypes'

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

const RichTextCellValue: FunctionComponent<{ value: IRichTextValue }> = ({
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

  const { data: sheetData, columnWidthsAdjusted } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}

  let { value, type } = cellData

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
    width: columnWidthsAdjusted[columnIndex],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const cellComponent = useMemo(() => {
    let component
    switch (type) {
      case TYPE_RICH_TEXT:
        component = <RichTextCellValue value={value as IRichTextValue} />
        break
      case TYPE_FORMULA:
        value = value as IFormulaValue
        component = <NormalCellValue value={value.result as string} />
        break
      case TYPE_MERGE:
        break
      case TYPE_TEXT:
      default:
        value = value as any
        component = <NormalCellValue value={value as string | undefined} />
        break
    }
    return component
  }, [])

  return (
    <div
      className={`unselectable cell ${value ? 'cell__editable' : ''}`}
      style={adjustedStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {cellComponent}
    </div>
  )
}

export default EditableCell
