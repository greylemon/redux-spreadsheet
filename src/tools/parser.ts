import {
  Workbook,
  Worksheet,
  Cell,
  CellRichTextValue,
  WorksheetView,
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
  IFormulaValue,
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
import { getTableColumnCount, getTableRowCount } from '../redux/tools/table'
import {
  TYPE_RICH_TEXT,
  TYPE_FORMULA,
  TYPE_MERGE,
} from '../constants/cellTypes'

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

// | null | number | string | boolean | Date
// | CellErrorValue
// | CellRichTextValue | CellHyperlinkValue
// | CellFormulaValue | CellSharedFormulaValue;

export const getCellContent = (data: IRows, cell: any) => {
  const value = cell.value

  const content: ICell = {}

  switch (cell.type) {
    case ValueType.String:
      content.value = value as string
      break
    case ValueType.Formula:
      const { formula, sharedFormula, result } = cell.value
      content.value = {
        formula: formula ? formula : sharedFormula,
      } as IFormulaValue
      content.type = TYPE_FORMULA

      if (result) content.value.result = result
      break
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
    case ValueType.Merge:
      const {
        model: { address, master },
      } = cell._value
      const cellAddress = convertStringPositionToPosition(address)
      const masterAddress = convertStringPositionToPosition(master)

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
    case ValueType.Number:
      break
    default:
      break
  }

  return Object.keys(content).length ? content : undefined
}

export const getBoundedRow = (rowIndex: IRowIndex) =>
  rowIndex < SHEET_MAX_ROW_COUNT ? rowIndex : SHEET_MAX_ROW_COUNT
export const getBoundedColumn = (columnIndex: IColumnIndex) =>
  columnIndex < SHEET_MAX_COLUMN_COUNT ? columnIndex : SHEET_MAX_COLUMN_COUNT

export const getSheetDataFromSheet = (sheet: Worksheet) => {
  const data: IRows = {}

  sheet.eachRow((row, rowIndex) => {
    if (!data[rowIndex]) data[rowIndex] = {}
    row.eachCell((cell, columnIndex) => {
      data[rowIndex][columnIndex] = {}
      const content = getCellContent(data, cell)

      if (!content || !Object.keys(content).length)
        delete data[rowIndex][columnIndex]

      if (content) data[rowIndex][columnIndex] = content
    })

    if (!Object.keys(data[rowIndex]).length) delete data[rowIndex]
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

export const convertRawExcelToState = async (file: any) => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = new Workbook()
  const data = await workbook.xlsx.load(arrayBuffer)

  const content = createStateFromWorkbook(data)

  return content
}
