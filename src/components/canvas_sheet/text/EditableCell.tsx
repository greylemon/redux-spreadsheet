import React, { FunctionComponent, useMemo, CSSProperties } from 'react'
import { Text } from 'react-konva'
import { ICanvasCellProps } from '../../../@types/components'
import { IRichTextValue } from '../../../@types/state'

import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_MERGE,
  TYPE_NUMBER,
} from '../../../constants/types'

// https://stackoverflow.com/a/21015393/5425619
const getTextMetrics = (text: string, font: string): TextMetrics => {
  // re-use canvas object for better performance
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics
}

const NormalCellValue: FunctionComponent<
  Partial<ICanvasCellProps> & {
    value?: string
    style: CSSProperties | undefined
  }
> = ({ x, y, width, height, value, style }) => {
  let fontStyle = ''
  let textDecoration = ''
  // const verticalAlign = 'bottom'
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
      // verticalAlign={verticalAlign}
      fontStyle={fontStyle}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fontColor}
      padding={4}
      textDecoration={textDecoration}
      perfectDrawEnabled={false}
      hitStrokeWidth={0}
      ellipsis
    />
  )
}

// TODO
const RichTextCellValue: FunctionComponent<
  Partial<ICanvasCellProps> & { value: IRichTextValue }
> = ({ value, height, width, x, y }) => {
  const Components: JSX.Element[] = []
  const fontFamily = 'Calibri'
  const fontSize = '12px'

  const defaultStyle = `${fontSize} ${fontFamily}`

  let curY = y

  for (let blockIndex = 0; blockIndex < value.length; blockIndex += 1) {
    const { fragments } = value[blockIndex]
    let curX = x
    let maxCurY = 0

    // ! May contain return symbol
    for (
      let fragmentIndex = 0;
      fragmentIndex < fragments.length;
      fragmentIndex += 1
    ) {
      const { key, style, text } = fragments[fragmentIndex]

      Components.push(
        <NormalCellValue
          key={key}
          value={text}
          style={style}
          height={height}
          width={width}
          x={curX}
          y={curY}
        />
      )

      let metrics: TextMetrics

      if (style) {
        metrics = getTextMetrics(
          text,
          `${style.fontSize || fontSize} ${style.fontFamily || fontFamily} ${
            style.textDecoration
          } ${style.fontWeight}`
        )
      } else {
        metrics = getTextMetrics(text, defaultStyle)
      }

      const { width: metricWidth, actualBoundingBoxAscent } = metrics
      maxCurY = Math.max(maxCurY, actualBoundingBoxAscent)
      curX += metricWidth

      if (text && text[text.length - 1] === '\n') {
        curX = x
        curY += maxCurY + 3
      }
    }

    curY += maxCurY + 3
    maxCurY = 0
  }

  return <>{Components}</>
}

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
  }, [value, type, sheetResults, x, y, width, height, style])

  return cellComponent
}

export default EditableCell
