import {
  Workbook,
  Worksheet,
  Cell,
  CellRichTextValue,
  WorksheetView,
  Column,
} from 'exceljs'
import {
  IRows,
  IPosition,
  IRowIndex,
  IColumnIndex,
  IRichText,
} from '../../../@types/excel/state'
import { DEFAULT } from '../constants/defaults'
import { numberRegex } from './regex'
import { ValueType } from '../constants/exceljs'

// TODO
export const getStylesFromCell = (_cell: Cell) => {
  // const style = cell.style
  // const {
  //   alignment,
  //   border,
  //   fill,
  //   font,
  //   numFmt,
  //   protection
  // } = style
}

// TODO
export const getRichTextFromCellValue = (_value: CellRichTextValue) => {
  const richText: IRichText = []
  return richText
}

// | null | number | string | boolean | Date
// | CellErrorValue
// | CellRichTextValue | CellHyperlinkValue
// | CellFormulaValue | CellSharedFormulaValue;

export const getValueFromCell = (cell: Cell) => {
  // const value = cell.value

  switch (cell.type) {
    case ValueType.String:
      break
    case ValueType.Formula:
      break
    case ValueType.RichText:
      break
    case ValueType.Boolean:
      break
    case ValueType.Date:
      break
    case ValueType.Error:
      break
    case ValueType.Merge:
      break
    case ValueType.Number:
      break
    default:
      break
  }
}

export const getBoundedRow = (rowIndex: IRowIndex) =>
  rowIndex < DEFAULT.maxRowCount ? rowIndex : DEFAULT.maxRowCount
export const getBoundedColumn = (columnIndex: IColumnIndex) =>
  columnIndex < DEFAULT.maxColumnCount ? columnIndex : DEFAULT.maxColumnCount

export const getSheetDataFromSheet = (sheet: Worksheet) => {
  const data: IRows = {}

  sheet.eachRow((row) => {
    row.eachCell((_cell) => {
      // const styles = getStylesFromCell(cell)
      // const value = getValueFromCell(cell)
    })
  })

  return data
}

// https://stackoverflow.com/questions/667802/what-is-the-algorithm-to-convert-an-excel-column-letter-into-its-number
export const getColumnNumberFromColumnName = (name: string) => {
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

const getBoundedPositionFromString = (stringPosition: string) => {
  const activeCellPosition = convertStringPositionToPosition(stringPosition)
  activeCellPosition.x = getBoundedColumn(activeCellPosition.x)
  activeCellPosition.y = getBoundedRow(activeCellPosition.y)

  return activeCellPosition
}

const getPaneDataFromSheetViews = (views: Array<Partial<WorksheetView>>) => {
  const paneData = {
    activeCellPosition: DEFAULT.activeCellPosition,
    freezeColumnCount: DEFAULT.freezeColumnCount,
    freezeRowCount: DEFAULT.freezeRowCount,
  }

  views.forEach((view) => {
    const activeCell = view.activeCell
    if (activeCell)
      paneData.activeCellPosition = getBoundedPositionFromString(activeCell)

    switch (view.state) {
      case 'normal':
        break
      case 'frozen':
        paneData.freezeColumnCount = view.xSplit!
        paneData.freezeRowCount = view.ySplit!
        break
      case 'split':
        break
    }
  })

  return paneData
}

export const getColumnDataFromColumns = (columns: Partial<Column>[]) => {
  const columnWidths: { [key: string]: number } = {}
  const hiddenColumns: { [key: string]: boolean } = {}

  columns.forEach(({ width, hidden }, index) => {
    if (width) columnWidths[index] = width
    if (hidden) hiddenColumns[index] = true
  })

  return {
    columnWidths,
    hiddenColumns,
  }
}

// ! Not needed because sheet data iterates over rows
export const getRowDataFromSheet = (rows: Worksheet) => {
  const rowHeights: { [key: string]: number } = {}
  const hiddenRows: { [key: string]: boolean } = {}

  rows.eachRow(({ height, hidden }, index) => {
    if (height) rowHeights[index] = height
    if (hidden) hiddenRows[index] = true
  })

  return {
    rowHeights,
    hiddenRows,
  }
}

const createStateFromWorkbook = (workbook: Workbook) => {
  const sheetContentMap: {
    [key: string]: {
      activeCellPosition: IPosition
      columnCount: number
      rowCount: number
      columnWidths: { [key: string]: number }
      rowHeights: { [key: string]: number }
      hiddenColumns: { [key: string]: boolean }
      hiddenRows: { [key: string]: boolean }
      freezeColumnCount: number
      freezeRowCount: number
      data: IRows
    }
  } = {}

  workbook.eachSheet((sheet) => {
    sheetContentMap[sheet.name] = {
      data: getSheetDataFromSheet(sheet),
      columnCount: sheet.columnCount,
      rowCount: sheet.rowCount,
      ...getPaneDataFromSheetViews(sheet.views),
      ...getColumnDataFromColumns(sheet.columns),
      ...getRowDataFromSheet(sheet),
    }
  })

  return sheetContentMap
}

export const convertRawExcelToState = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = new Workbook()
  const data = await workbook.xlsx.load(arrayBuffer)

  const content = createStateFromWorkbook(data)

  return content
}
