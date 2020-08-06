import {
  Workbook,
  Worksheet,
  CellRichTextValue,
  WorksheetView,
  Cell,
  Borders,
  Border,
  Color as ExcelColor,
  Fill,
  Font,
} from 'exceljs'
import uniqid from 'uniqid'
import Color from 'color'
import cloneDeep from 'clone-deep'
import {
  IRows,
  IPosition,
  IRowIndex,
  IColumnIndex,
  IRichTextValue,
  IRichTextBlock,
  IInlineStyles,
  ISheetNames,
  ISheetsMap,
  ICell,
  IActiveCellPosition,
  IFreezeColumnCount,
  IFreezeRowCount,
  IColumnWidths,
  IHiddenColumns,
  IRowHeights,
  IHiddenRows,
  IExcelState,
  IStyles,
  IBlockStyles,
} from '../@types/state'
import {
  SHEET_MAX_ROW_COUNT,
  SHEET_MAX_COLUMN_COUNT,
  ACTIVE_CELL_POSITION,
  SHEET_FREEZE_COLUMN_COUNT,
  SHEET_FREEZE_ROW_COUNT,
} from '../constants/defaults'
import { ValueType } from '../@types/exceljs'
import { getTableColumnCount, getTableRowCount } from './table'
import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_MERGE,
  TYPE_TEXT,
  TYPE_NUMBER,
} from '../constants/types'
import { initialExcelState } from '../redux/store'
import { indexedColors, themes } from '../constants/colors'
import { applyTintToColor } from './color'

import {
  setUnderlineStyle,
  setStrikethroughStyle,
  setItalicStyle,
  setBoldStyle,
} from './style'
import { convertStringPositionToPosition } from './conversion'

const getFormattedColor = (
  color: Partial<ExcelColor> & {
    indexed?: number
    tint?: number
  }
): string => {
  let formattedColor = ''

  const { argb, indexed, theme, tint } = color

  if (argb) {
    formattedColor = `#${argb.substring(2)}`
  } else if (indexed) {
    formattedColor = indexedColors[indexed % indexedColors.length]
  } else if (theme) {
    formattedColor = themes[theme % themes.length]

    if (tint) formattedColor = applyTintToColor(new Color(formattedColor), tint)
  }

  return formattedColor
}

const getBorderStyleInPlace = (
  section: 'Top' | 'Bottom' | 'Left' | 'Right',
  border: Partial<Border>,
  styles: IBlockStyles
) => {
  const { style, color } = border

  styles[
    `border${section}Style` as
      | 'borderTopStyle'
      | 'borderLeftStyle'
      | 'borderBottomStyle'
      | 'borderLeftStyle'
  ] = 'solid'

  if (style) {
    styles[
      `border${section}Width` as
        | 'borderTopWidth'
        | 'borderLeftWidth'
        | 'borderBottomWidth'
        | 'borderLeftWidth'
    ] = style
  }

  if (color) {
    const borderColor: string = getFormattedColor(color)

    if (borderColor)
      styles[
        `border${section}Color` as
          | 'borderTopColor'
          | 'borderRightColor'
          | 'borderBottomColor'
          | 'borderLeftColor'
      ] = borderColor
  }
}

const getAllBorderStylesInPlace = (
  borders: Partial<Borders>,
  styles: IBlockStyles
): void => {
  const { bottom, left, top, right } = borders

  if (bottom) getBorderStyleInPlace('Bottom', bottom, styles)
  if (left) getBorderStyleInPlace('Left', left, styles)
  if (top) getBorderStyleInPlace('Top', top, styles)
  if (right) getBorderStyleInPlace('Right', right, styles)
}

// TODO : Pattern
// TODO : Gradient
const getFillInPlace = (fill: Fill, styles: IBlockStyles): void => {
  switch (fill.type) {
    case 'gradient':
      break

    case 'pattern':
    default: {
      const { fgColor } = fill

      if (fgColor) {
        styles.backgroundColor = getFormattedColor(fgColor)
      }

      break
    }
  }
}

export const setFontStyleInPlaceFromFont = (
  font: Partial<Font>,
  style: IInlineStyles
): void => {
  const { bold, italic, strike, underline } = font

  if (bold) setBoldStyle(style)
  if (italic) setItalicStyle(style)
  if (strike) setStrikethroughStyle(style)
  if (underline) setUnderlineStyle(style)
}

export const getStylesFromCell = (cell: Cell): IStyles | undefined => {
  const styles: IStyles = {
    block: {},
    font: {},
  }
  const { style } = cell
  const {
    // alignment,
    border,
    fill,
    font,
    // numFmt,
    // protection
  } = style

  if (fill) getFillInPlace(fill, styles.block)

  if (border) getAllBorderStylesInPlace(border, styles.block)

  if (font) setFontStyleInPlaceFromFont(font, styles.font)

  return Object.keys(styles).length ? styles : undefined
}

// TODO
export const getRichTextFromCellValue = (
  value: CellRichTextValue
): IRichTextValue => {
  const richText: IRichTextValue = []

  // TODO : find how block works in exceljs - for now only one block
  const richTextBlock: IRichTextBlock = {
    fragments: [],
    key: uniqid(),
  }

  value.richText.forEach(({ font, text }) => {
    const style: IInlineStyles = {}
    if (font) setFontStyleInPlaceFromFont(font, style)

    richTextBlock.fragments.push({
      style,
      text,
      key: uniqid(),
    })
  })

  richText.push(richTextBlock)

  return richText
}

export const getCellContent = (data: IRows, cell: any): ICell | undefined => {
  const { value } = cell

  const content: ICell = {}

  const styles = getStylesFromCell(cell)
  if (styles) content.style = styles

  switch (cell.type) {
    case ValueType.Number:
      content.value = value
      content.type = TYPE_NUMBER
      break
    case ValueType.String:
      content.value = value
      content.type = TYPE_TEXT
      break
    case ValueType.Formula: {
      const { formula, sharedFormula } = cell.value
      const formulaValue: string = formula || sharedFormula

      content.value = formulaValue
      content.type = TYPE_FORMULA

      break
    }
    case ValueType.RichText:
      content.value = getRichTextFromCellValue(value as CellRichTextValue)
      content.type = TYPE_RICH_TEXT
      break
    case ValueType.Boolean:
      break
    case ValueType.Date:
      break
    case ValueType.Error:
      break
    case ValueType.Merge: {
      const cellAddress = convertStringPositionToPosition(
        cell._value.model.address
      )
      const masterAddress = convertStringPositionToPosition(
        cell._value.model.master
      )

      content.type = TYPE_MERGE

      content.merged = {
        parent: masterAddress,
      }

      const parentCell = data[masterAddress.y][masterAddress.x]
      parentCell.merged = {
        area: {
          start: masterAddress,
          end: cellAddress,
        },
      }

      break
    }
    default:
      break
  }

  return Object.keys(content).length ? content : undefined
}

export const getBoundedRow = (rowIndex: IRowIndex): IRowIndex =>
  rowIndex < SHEET_MAX_ROW_COUNT ? rowIndex : SHEET_MAX_ROW_COUNT
export const getBoundedColumn = (columnIndex: IColumnIndex): IColumnIndex =>
  columnIndex < SHEET_MAX_COLUMN_COUNT ? columnIndex : SHEET_MAX_COLUMN_COUNT

export const getSheetDataFromSheet = (sheet: Worksheet): IRows => {
  const data: IRows = {}

  sheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    if (!data[rowIndex]) data[rowIndex] = {}

    row.eachCell({ includeEmpty: true }, (cell, columnIndex) => {
      if (Object.keys(cell).length) {
        data[rowIndex][columnIndex] = {}
        const content = getCellContent(data, cell)

        if (!content || !Object.keys(content).length)
          delete data[rowIndex][columnIndex]

        if (content) data[rowIndex][columnIndex] = content
      }
    })

    if (!Object.keys(data[rowIndex]).length) delete data[rowIndex]
  })

  return data
}

const getBoundedPositionFromString = (stringPosition: string): IPosition => {
  const activeCellPosition = convertStringPositionToPosition(stringPosition)
  activeCellPosition.x = getBoundedColumn(activeCellPosition.x)
  activeCellPosition.y = getBoundedRow(activeCellPosition.y)

  return activeCellPosition
}

const getPaneDataFromSheetViews = (
  views: Array<Partial<WorksheetView>>
): {
  activeCellPosition: IActiveCellPosition
  freezeColumnCount: IFreezeColumnCount
  freezeRowCount: IFreezeRowCount
} => {
  const paneData = {
    activeCellPosition: ACTIVE_CELL_POSITION,
    freezeColumnCount: SHEET_FREEZE_COLUMN_COUNT,
    freezeRowCount: SHEET_FREEZE_ROW_COUNT,
    topLeftPosition: { x: 1, y: 1 },
  }

  views.forEach((view) => {
    const { activeCell } = view
    if (activeCell)
      paneData.activeCellPosition = getBoundedPositionFromString(activeCell)

    switch (view.state) {
      case 'normal':
        break
      case 'frozen':
        paneData.freezeColumnCount = view.xSplit ? view.xSplit : 0
        paneData.freezeRowCount = view.ySplit ? view.ySplit : 0
        paneData.topLeftPosition.x = paneData.freezeColumnCount + 1
        paneData.topLeftPosition.y = paneData.freezeRowCount + 1
        break
      case 'split':
        break
      default:
        break
    }
  })

  return paneData
}

export const getColumnDataFromColumns = (
  sheet: Worksheet
): { columnWidths: IColumnWidths; hiddenColumns: IHiddenColumns } => {
  const columnWidths: IColumnWidths = {}
  const hiddenColumns: IHiddenColumns = {}

  const { columnCount } = sheet

  for (let i = 1; i <= columnCount; i += 1) {
    const { width, hidden } = sheet.getColumn(i)

    if (width) columnWidths[i] = width
    if (hidden) hiddenColumns[i] = true
  }

  return {
    columnWidths,
    hiddenColumns,
  }
}

// ! Not needed because sheet data iterates over rows
export const getRowDataFromSheet = (
  sheet: Worksheet
): { rowHeights: IRowHeights; hiddenRows: IHiddenRows } => {
  const rowHeights: IRowHeights = {}
  const hiddenRows: IHiddenRows = {}
  const { rowCount } = sheet

  for (let i = 1; i <= rowCount; i += 1) {
    const { height, hidden } = sheet.getRow(i)

    if (height) rowHeights[i] = height
    if (hidden) hiddenRows[i] = true
  }

  return {
    rowHeights,
    hiddenRows,
  }
}

export const createStateFromWorkbook = (workbook: Workbook): IExcelState => {
  const sheetsMap: ISheetsMap = {}

  const sheetNames: ISheetNames = []
  let activeTab = 1

  workbook.views.forEach((view) => {
    if (view.activeTab) activeTab = view.activeTab
  })

  const activeSheetName = workbook.getWorksheet(activeTab).name

  workbook.eachSheet((sheet) => {
    sheetNames.push(sheet.name)

    sheetsMap[sheet.name] = {
      data: getSheetDataFromSheet(sheet),
      columnCount: getTableColumnCount(sheet.columnCount),
      rowCount: getTableRowCount(sheet.rowCount),
      ...getPaneDataFromSheetViews(sheet.views),
      ...getColumnDataFromColumns(sheet),
      ...getRowDataFromSheet(sheet),
      inactiveSelectionAreas: [],
    }
  })

  return {
    ...cloneDeep(initialExcelState),
    selectionAreaIndex: -1,
    inactiveSelectionAreas: [],
    sheetsMap,
    sheetNames,
    activeSheetName,
  }
}
