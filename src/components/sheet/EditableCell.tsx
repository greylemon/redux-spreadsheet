import React, { FunctionComponent, useMemo, CSSProperties } from 'react'
import { ICellProps } from '../../@types/components'
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
  style: styles,
}) => (
  <div className="richText__cell" style={styles}>
    {value}
  </div>
)

const RichTextBlock: FunctionComponent<IRichTextBlock> = ({ fragments }) => (
  <div className="richText__block">
    {fragments.map(({ key, style: styles, text }) => (
      <RichTextFragment key={key} style={styles} text={text} />
    ))}
  </div>
)

const RichTextCellValue: FunctionComponent<{ value: IRichTextValue }> = ({
  value,
}) => (
  <>
    {value.map(({ key, fragments }) => (
      <RichTextBlock key={key} fragments={fragments} />
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
  const {
    data: sheetData,
    columnWidthsAdjusted,
    sheetResults,
    cellLayering,
    columnOffsets,
    rowOffsets,
  } = data

  const rowData = sheetData[rowIndex]
  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}
  const { value, type, style: cellStyle, merged } = cellData
  const layerIndex = cellLayering[rowIndex][columnIndex]

  style = useMemo(
    (): CSSProperties =>
      merged && merged.area && type !== TYPE_MERGE
        ? {
            ...style,
            height:
              rowOffsets[merged.area.end.y + 1] -
              rowOffsets[merged.area.start.y],
            width:
              columnOffsets[merged.area.end.x + 1] -
              columnOffsets[merged.area.start.x],
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
        let formulaStringValue: undefined | string

        try {
          const formulaValue = sheetResults[rowIndex][columnIndex]
          formulaStringValue = formulaValue.toString()
        } catch (error) {
          formulaStringValue = ''
        }

        component = <NormalCellValue value={formulaStringValue} />
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
    <div>
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
