import {
  Workbook,
  Worksheet,
  Cell,
  CellRichTextValue,
  WorksheetView,
  CellSharedFormulaValue,
  CellFormulaValue,
} from 'exceljs'
import {
  IRows,
  IPosition,
  IRowIndex,
  IColumnIndex,
  IRichText,
  IRichTextBlock,
  IInlineStyles,
  IValue,
  ISheetNames,
  ISheetsMap,
} from '../../../@types/excel/state'
import { DEFAULT } from '../constants/defaults'
import { numberRegex } from './regex'
import { ValueType } from '../../../@types/exceljs'
import uniqid from 'uniqid'
import {
  getTableColumnCount,
  getTableRowCount,
} from '../../../redux/ExcelStore/tools/table'

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
  return
}

// TODO
export const getRichTextFromCellValue = (value: CellRichTextValue) => {
  const richText: IRichText = []

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

export const getFormulaFromCellValue = (
  value: CellFormulaValue & CellSharedFormulaValue
) => {
  // const formula = {

  // }

  // if(value.formula) {

  // } else {

  // }

  return ''
}

// | null | number | string | boolean | Date
// | CellErrorValue
// | CellRichTextValue | CellHyperlinkValue
// | CellFormulaValue | CellSharedFormulaValue;

export const getValueFromCell = (cell: Cell) => {
  const value = cell.value

  let result: IValue | undefined = undefined

  // console.log(cell.type)
  // ValueType.

  switch (cell.type) {
    case ValueType.String:
      result = value as string
      break
    case ValueType.Formula:
      result = getFormulaFromCellValue(
        value as CellFormulaValue & CellSharedFormulaValue
      )
      break
    case ValueType.RichText:
      result = getRichTextFromCellValue(value as CellRichTextValue)
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

  return result
}

export const getBoundedRow = (rowIndex: IRowIndex) =>
  rowIndex < DEFAULT.maxRowCount ? rowIndex : DEFAULT.maxRowCount
export const getBoundedColumn = (columnIndex: IColumnIndex) =>
  columnIndex < DEFAULT.maxColumnCount ? columnIndex : DEFAULT.maxColumnCount

export const getSheetDataFromSheet = (sheet: Worksheet) => {
  const data: IRows = {}

  sheet.eachRow((row, rowIndex) => {
    row.eachCell((cell, columnIndex) => {
      if (!data[rowIndex]) data[rowIndex] = {}
      data[rowIndex][columnIndex] = {
        value: getValueFromCell(cell),
      }
      // const styles = getStylesFromCell(cell)
      // const value =
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

export const getColumnDataFromColumns = (sheet: Worksheet) => {
  const columnWidths: { [key: string]: number } = {}
  const hiddenColumns: { [key: string]: boolean } = {}

  const columns = sheet.columns

  columns.forEach(({ width, hidden }, index) => {
    if (width) columnWidths[index + 1] = width

    if (hidden) hiddenColumns[index + 1] = true
  })

  return {
    columnWidths,
    hiddenColumns,
  }
}

// ! Not needed because sheet data iterates over rows
export const getRowDataFromSheet = (sheet: Worksheet) => {
  const rowHeights: { [key: string]: number } = {}
  const hiddenRows: { [key: string]: boolean } = {}

  sheet.eachRow(({ height, hidden }, index) => {
    if (height) rowHeights[index + 1] = height

    if (hidden) hiddenRows[index + 1] = true
  })

  return {
    rowHeights,
    hiddenRows,
  }
}

const createStateFromWorkbook = (workbook: Workbook) => {
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
      inactiveSelectionAreas: [],
      selectionAreaIndex: -1,
      ...getPaneDataFromSheetViews(sheet.views),
      ...getColumnDataFromColumns(sheet),
      ...getRowDataFromSheet(sheet),
    }
  })

  return { sheetsMap, sheetNames, activeSheetName }
}

export const convertRawExcelToState = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = new Workbook()
  const data = await workbook.xlsx.load(arrayBuffer)

  const content = createStateFromWorkbook(data)

  return content
}
