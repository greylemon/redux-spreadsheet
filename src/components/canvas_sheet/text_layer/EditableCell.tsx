import React, { FunctionComponent, useMemo } from 'react'
import { Text } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import {
  IRichTextValue,
  IFragment,
  IRichTextBlock,
} from '../../../@types/state'

import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
  TYPE_NUMBER,
} from '../../../constants/types'

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
    {fragments.map(({ key, styles, text }) => (
      <RichTextFragment key={key} styles={styles} text={text} />
    ))}
  </div>
)

const RichTextCellValue: FunctionComponent<
  Partial<ICanvasCellProps> & { value: IRichTextValue }
> = ({ value }) => (
  <>
    {value.map(({ key, fragments }) => (
      <RichTextBlock key={key} fragments={fragments} />
    ))}
  </>
)

const NormalCellValue: FunctionComponent<
  Partial<ICanvasCellProps> & { value?: string }
> = ({ x, y, width, height, value }) => (
  <Text text={value} x={x} y={y} width={width} height={height} />
)

const EditableCell: FunctionComponent<ICanvasCellProps> = ({
  x,
  y,
  width,
  height,
  columnIndex,
  rowIndex,
  data,
}) => {
  const { data: sheetData, sheetResults } = data

  const rowData = sheetData[rowIndex]
  const cellData = rowData && rowData[columnIndex] ? rowData[columnIndex] : {}
  const { value, type } = cellData

  const cellComponent = useMemo(() => {
    let component: JSX.Element = null

    switch (type) {
      case TYPE_RICH_TEXT:
        component = (
          <RichTextCellValue
            x={x}
            y={y}
            width={width}
            height={height}
            value={value as IRichTextValue}
          />
        )
        break
      case TYPE_FORMULA: {
        let formulaStringValue: undefined | string

        try {
          const formulaValue = sheetResults[rowIndex][columnIndex]
          formulaStringValue = formulaValue.toString()
        } catch (error) {
          formulaStringValue = ''
        }

        component = (
          <NormalCellValue
            x={x}
            y={y}
            width={width}
            height={height}
            value={formulaStringValue}
          />
        )
        break
      }
      case TYPE_MERGE:
        break
      case TYPE_NUMBER:
        component = (
          <NormalCellValue
            x={x}
            y={y}
            width={width}
            height={height}
            value={value.toString()}
          />
        )
        break
      case TYPE_TEXT:
      default:
        component = (
          <NormalCellValue
            x={x}
            y={y}
            width={width}
            height={height}
            value={value as string | undefined}
          />
        )
        break
    }
    return component
  }, [value, sheetResults, x, y, width, height])

  // const id = useMemo(() => `cell={"y":${rowIndex},"x":${columnIndex}}`, [
  //   rowIndex,
  //   columnIndex,
  // ])

  return cellComponent
}

export default EditableCell
