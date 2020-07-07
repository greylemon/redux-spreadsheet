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
} from 'exceljs'
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
} from '../@types/state'
import {
  SHEET_MAX_ROW_COUNT,
  SHEET_MAX_COLUMN_COUNT,
  ACTIVE_CELL_POSITION,
  SHEET_FREEZE_COLUMN_COUNT,
  SHEET_FREEZE_ROW_COUNT,
} from '../constants/defaults'
import { numberRegex } from './regex'
import { ValueType } from '../@types/exceljs'
import uniqid from 'uniqid'
import { getTableColumnCount, getTableRowCount } from './table'
import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_MERGE,
  TYPE_TEXT,
  TYPE_NUMBER,
} from '../constants/cellTypes'
import { initialExcelState } from '../redux/store'
import { indexedColors, themes } from '../constants/colors'
import { applyTintToColor } from './color'
import FormulaParser from 'fast-formula-parser'
import Color from 'color'
import { IFormulaMap } from '../@types/objects'
import fs from 'fs'

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
  styles: IStyles
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
  styles: IStyles
) => {
  const { bottom, left, top, right } = borders

  if (bottom) getBorderStyleInPlace('Bottom', bottom, styles)
  if (left) getBorderStyleInPlace('Left', left, styles)
  if (top) getBorderStyleInPlace('Top', top, styles)
  if (right) getBorderStyleInPlace('Right', right, styles)
}

// TODO : Pattern
// TODO : Gradient
const getFillInPlace = (fill: Fill, styles: IStyles) => {
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

export const getStylesFromCell = (cell: Cell): IStyles | undefined => {
  const styles: IStyles = {}
  const style = cell.style
  const {
    // alignment,
    border,
    fill,
    // font,
    // numFmt,
    // protection
  } = style

  if (fill) getFillInPlace(fill, styles)

  if (border) getAllBorderStylesInPlace(border, styles)

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
    if (font) {
      const { bold, italic, strike, underline } = font

      if (italic) style.fontStyle = 'italic'
      if (bold) style.fontWeight = 'bold'

      if (strike && underline) {
        style.textDecoration = 'line-through underline'
      } else if (strike) {
        style.textDecoration = 'line-through'
      } else if (underline) {
        style.textDecoration = 'underline'
      }

      richTextBlock.fragments.push({
        styles: style,
        text,
        key: uniqid(),
      })
    }
  })

  richText.push(richTextBlock)

  return richText
}

export const createFormulaParser = (
  sheetsData: {
    [key: string]: IRows
  },
  formulaMap: IFormulaMap
): FormulaParser =>
  new FormulaParser({
    onCell: ({ sheet, row: rowIndex, col: columnIndex }) => {
      const sheetContent = sheetsData[sheet]
      if (sheetContent) {
        if (sheetContent[rowIndex] && sheetContent[rowIndex][columnIndex]) {
          const cell = sheetContent[rowIndex][columnIndex]
          let value: string | number | null = 0

          switch (cell.type) {
            case TYPE_FORMULA:
              if (formulaMap[sheet] && formulaMap[sheet][rowIndex])
                value = formulaMap[sheet][rowIndex][columnIndex]
              break
            case TYPE_NUMBER:
            case TYPE_TEXT:
              value = cell.value as string | number
              break
          }

          return value
        }
      }
    },
    onRange: ({ from, to, sheet }) => {
      const rangeData = []
      const sheetContent = sheetsData[sheet]

      if (sheetContent) {
        for (let rowIndex = from.row; rowIndex <= to.row; rowIndex++) {
          const row = sheetContent[rowIndex]
          const rowArray = []
          if (row) {
            for (
              let columnIndex = from.col;
              columnIndex <= to.col;
              columnIndex++
            ) {
              const cell = row[columnIndex]
              let value: string | number | null = null

              if (cell) {
                switch (cell.type) {
                  case TYPE_FORMULA:
                    if (formulaMap[sheet] && formulaMap[sheet][rowIndex])
                      value = formulaMap[sheet][rowIndex][columnIndex]
                    break
                  case TYPE_NUMBER:
                  case TYPE_TEXT:
                    value = cell.value as string | number
                    break
                }
              }

              rowArray.push(value)
            }
          }

          rangeData.push(rowArray)
        }
      }

      return rangeData
    },
  })

export const getCellContent = (data: IRows, cell: any): ICell | undefined => {
  const value = cell.value

  const content: ICell = {}

  const styles = getStylesFromCell(cell)
  if (styles) content.styles = styles

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
      const formulaValue: string = formula ? formula : sharedFormula

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
      const {
        model: { address, master },
      } = cell._value
      const cellAddress = convertStringPositionToPosition(
        cell._value.model.address
      )
      const masterAddress = convertStringPositionToPosition(
        cell._value.model.master
      )

      const merged = {
        start: masterAddress,
        end: cellAddress,
      }

      content.merged = merged
      content.type = TYPE_MERGE
      if (address !== master) {
        data[masterAddress.y][masterAddress.x] = {
          ...data[masterAddress.y][masterAddress.x],
          merged,
        }
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

// https://stackoverflow.com/questions/667802/what-is-the-algorithm-to-convert-an-excel-column-letter-into-its-number
export const getColumnNumberFromColumnName = (name: string): IColumnIndex => {
  let sum = 0

  for (let i = 0; i < name.length; i++) {
    sum *= 26
    sum += name.charCodeAt(i) - ('A'.charCodeAt(0) - 1)
  }

  return sum
}

export const convertStringPositionToPosition = (
  stringPosition: string
): IPosition => {
  const rowStartIndex = stringPosition.search(numberRegex)
  const columnLetter = stringPosition.substring(0, rowStartIndex)

  return {
    x: getColumnNumberFromColumnName(columnLetter),
    y: +stringPosition.substring(rowStartIndex, stringPosition.length),
  }
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
  }

  views.forEach((view) => {
    const activeCell = view.activeCell
    if (activeCell)
      paneData.activeCellPosition = getBoundedPositionFromString(activeCell)

    switch (view.state) {
      case 'normal':
        break
      case 'frozen':
        paneData.freezeColumnCount = view.xSplit ? view.xSplit : 0
        paneData.freezeRowCount = view.ySplit ? view.ySplit : 0
        break
      case 'split':
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

  const columnCount = sheet.columnCount

  for (let i = 1; i <= columnCount; i++) {
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
  const rowCount = sheet.rowCount

  for (let i = 1; i <= rowCount; i++) {
    const { height, hidden } = sheet.getRow(i)

    if (height) rowHeights[i] = height
    if (hidden) hiddenRows[i] = true
  }

  return {
    rowHeights,
    hiddenRows,
  }
}

const createStateFromWorkbook = (workbook: Workbook): IExcelState => {
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
    }
  })

  return {
    ...initialExcelState,
    selectionAreaIndex: -1,
    inactiveSelectionAreas: [],
    sheetsMap,
    sheetNames,
    activeSheetName,
  }
}

export const convertRawExcelToState = async (
  file: File | string
): Promise<IExcelState> => {
  const workbook = new Workbook()
  let data: Workbook

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer()
    data = await workbook.xlsx.load(arrayBuffer)
  } else {
    data = await workbook.xlsx.readFile(file)
  }

  return createStateFromWorkbook(data)
}

export const readFileFromPath = async (path: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
