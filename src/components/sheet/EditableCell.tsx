import React, { MouseEvent, FunctionComponent, Fragment, useMemo } from 'react'
import { ICellProps } from '../../@types/components'
import { useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/store'
import {
  IRichTextValue,
  IFragment,
  IRichTextBlock,
  IStyles,
} from '../../@types/state'
import { CSSProperties } from 'react'
import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
  TYPE_NUMBER,
} from '../../constants/cellTypes'
import {
  STYLE_OVERLAP_Z_INDEX,
  STYLE_BLOCK_Z_INDEX,
  STYLE_CONTENT_Z_INDEX,
} from '../../constants/styles'

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

const EditableCell: FunctionComponent<ICellProps> = ({
  style,
  data,
  columnIndex,
  rowIndex,
}) => {
  const dispatch = useDispatch()

  const { data: sheetData, columnWidthsAdjusted, formulaResults } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}

  const { value, type, styles } = cellData

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

  const contentStyle: CSSProperties | IStyles = {
    ...style,
    width: columnWidthsAdjusted[columnIndex],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    zIndex: STYLE_CONTENT_Z_INDEX + columnIndex,
  }

  const overlapStyle: CSSProperties = {
    ...style,
    width: columnWidthsAdjusted[columnIndex],
    zIndex: STYLE_OVERLAP_Z_INDEX + columnIndex + (value ? 1 : 0),
  }

  const blockStyle: CSSProperties = {
    ...style,
    ...styles,
    boxSizing: 'border-box',
    zIndex: STYLE_BLOCK_Z_INDEX + columnIndex + (value ? 1 : 0),
  }

  const cellComponent = useMemo(() => {
    let component: JSX.Element

    switch (type) {
      case TYPE_RICH_TEXT:
        component = <RichTextCellValue value={value as IRichTextValue} />
        break
      case TYPE_FORMULA: {
        let value: undefined | string

        try {
          const formulaValue = formulaResults[rowIndex][columnIndex]
          value = formulaValue.toString()
        } catch (error) {
          value = ''
        }

        component = <NormalCellValue value={value} />
        break
      }
      case TYPE_MERGE:
        break
      case TYPE_NUMBER:
        component = <NormalCellValue value={value.toString()} />
        break
      case TYPE_TEXT:
      default:
        component = <NormalCellValue value={value as string | undefined} />
        break
    }
    return component
  }, [value, formulaResults])

  return (
    <div onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter}>
      <span style={contentStyle} className={`unselectable cell cell__content`}>
        {cellComponent}
      </span>
      <span className={value ? 'cell__editable' : ''} style={overlapStyle} />
      <span className="cell__block" style={blockStyle} />
    </div>
  )
}

export default EditableCell
