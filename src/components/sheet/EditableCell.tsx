import React, {
  MouseEvent,
  FunctionComponent,
  useMemo,
  useCallback,
  CSSProperties,
} from 'react'
import { useDispatch } from 'react-redux'
import { ICellProps } from '../../@types/components'
import { ExcelActions } from '../../redux/store'
import {
  IRichTextValue,
  IFragment,
  IRichTextBlock,
  IStyles,
} from '../../@types/state'

import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
  TYPE_NUMBER,
} from '../../constants/types'
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
  <>
    {value.map((data) => (
      <RichTextBlock {...data} />
    ))}
  </>
)

const NormalCellValue: FunctionComponent<{ value?: string }> = ({ value }) => (
  <>{value}</>
)

const EditableCell: FunctionComponent<ICellProps> = ({
  style,
  data,
  columnIndex,
  rowIndex,
}) => {
  const dispatch = useDispatch()

  const {
    data: sheetData,
    columnWidthsAdjusted,
    sheetResults,
    cellLayering,
    columnOffsets,
    rowOffsets,
    handleDoubleClick,
  } = data

  const rowData = sheetData[rowIndex]

  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}

  const { value, type, style: cellStyle, merged } = cellData

  const position = { x: columnIndex, y: rowIndex }
  const layerIndex = cellLayering[rowIndex][columnIndex]

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
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
    },
    [dispatch]
  )

  style = useMemo(
    (): CSSProperties =>
      merged && type !== TYPE_MERGE
        ? {
            ...style,
            height: rowOffsets[merged.end.y + 1] - rowOffsets[merged.start.y],
            width:
              columnOffsets[merged.end.x + 1] - columnOffsets[merged.start.x],
          }
        : style,
    [style, merged, type, rowOffsets, columnOffsets]
  )

  const contentStyle: CSSProperties | IStyles = useMemo(
    () => ({
      ...style,
      ...(cellStyle ? cellStyle.font : undefined),
      width: merged ? style.width : columnWidthsAdjusted[columnIndex],
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      zIndex: STYLE_CONTENT_Z_INDEX + layerIndex,
    }),
    [style, cellStyle, columnWidthsAdjusted, columnIndex, layerIndex, merged]
  )

  // Only applies to non-merged cells
  const overlapStyle: CSSProperties = useMemo(
    () => ({
      ...style,
      width: columnWidthsAdjusted[columnIndex],
      boxSizing: 'border-box',
      zIndex: STYLE_OVERLAP_Z_INDEX + layerIndex,
    }),
    [style, columnIndex, columnWidthsAdjusted, layerIndex]
  )

  const blockStyle: CSSProperties = useMemo(
    () => ({
      ...style,
      ...(cellStyle ? cellStyle.block : undefined),
      boxSizing: 'border-box',
      zIndex: STYLE_BLOCK_Z_INDEX + layerIndex,
    }),
    [style, cellStyle, layerIndex]
  )

  const cellComponent = useMemo(() => {
    let component: JSX.Element = null

    switch (type) {
      case TYPE_RICH_TEXT:
        component = <RichTextCellValue value={value as IRichTextValue} />
        break
      case TYPE_FORMULA: {
        let value: undefined | string

        try {
          const formulaValue = sheetResults[rowIndex][columnIndex]
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
  }, [value, sheetResults])

  const id = useMemo(() => `cell={"y":${rowIndex},"x":${columnIndex}}`, [
    rowIndex,
    columnIndex,
  ])

  return (
    <div onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>
      <span id={id} style={contentStyle} className="unselectable cell__content">
        {cellComponent}
      </span>
      {!merged && (
        <span
          id={id}
          className={value ? 'cell__editable' : ''}
          style={overlapStyle}
        />
      )}
      {type !== TYPE_MERGE && (
        <span id={id} className="cell__block" style={blockStyle} />
      )}
    </div>
  )
}

export default EditableCell
