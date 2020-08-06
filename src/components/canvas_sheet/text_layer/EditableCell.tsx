import React, { FunctionComponent, useMemo, CSSProperties } from 'react'
import { Text } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
// import {
//   IRichTextValue,
//   IFragment,
//   IRichTextBlock,
// } from '../../../@types/state'

import {
  // TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
  TYPE_NUMBER,
} from '../../../constants/types'

const NormalCellValue: FunctionComponent<
  Partial<ICanvasCellProps> & {
    value?: string
    style: CSSProperties | undefined
  }
> = ({ x, y, width, height, value, style }) => {
  let fontStyle = ''
  let textDecoration = ''
  const verticalAlign = 'bottom'
  let fontFamily = 'Calibri'
  let fontSize = 12
  let fontColor = 'black'

  if (style) {
    if (style.fontWeight) fontStyle += style.fontWeight
    if (style.fontStyle) fontStyle += ` ${style.fontStyle}`
    if (style.textDecoration) textDecoration = style.textDecoration as string

    if (style.fontFamily) fontFamily = style.fontFamily
    if (style.fontSize) fontSize = style.fontSize as number
    if (style.color) fontColor = style.color
  }

  return (
    <Text
      text={value}
      x={x}
      y={y}
      width={width}
      height={height}
      transformsEnabled="position"
      verticalAlign={verticalAlign}
      fontStyle={fontStyle}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fontColor}
      padding={4}
      textDecoration={textDecoration}
    />
  )
}

// const RichTextFragment: FunctionComponent<IFragment> = ({
//   text: value,
//   style,
// }) => (
//   <div className="richText__cell" style={style}>
//     {value}
//   </div>
// )

// const RichTextBlock: FunctionComponent<IRichTextBlock> = ({ fragments }) => (
//   <>
//     {fragments.map(({ key, style: styles, text }) => (
//       <RichTextFragment key={key} style={styles} text={text} />
//     ))}
//   </>
// )

// const RichTextCellValue: FunctionComponent<
//   Partial<ICanvasCellProps> & { value: IRichTextValue }
// > = ({ value }) => (
//   <>
//     {value.map(({ key, fragments }) => (
//       <RichTextBlock key={key} fragments={fragments} />
//     ))}
//   </>
// )

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
  const { value, type, style } = cellData

  const cellComponent = useMemo(() => {
    let component: JSX.Element = null
    const fontStyle = style ? style.font : undefined

    switch (type) {
      // case TYPE_RICH_TEXT:
      //   component = (
      //     <RichTextCellValue
      //       x={x}
      //       y={y}
      //       width={width}
      //       height={height}
      //       value={value as IRichTextValue}
      //     />
      //   )
      //   break
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
            style={fontStyle}
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
            style={fontStyle}
          />
        )
        break
      case TYPE_TEXT:
        component = (
          <NormalCellValue
            x={x}
            y={y}
            width={width}
            height={height}
            value={value as string | undefined}
            style={fontStyle}
          />
        )
        break
      default:
        break
    }
    return component
  }, [value, sheetResults, x, y, width, height, style])

  return cellComponent
}

export default EditableCell
