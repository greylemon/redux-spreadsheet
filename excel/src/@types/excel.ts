type Position = { x: number; y: number }

type Area = { start: Position; end: Position }

type Error = object

type CSSLength = number | string
type CSSPercentage = string

type BlockStyles = {
  borderTopColor?: any
  borderTopWidth?: any
  borderTopStyle?: any

  borderLeftColor?: any
  borderLeftWidth?: any
  borderLeftStyle?: any

  borderRightColor?: any
  borderRightWidth?: any
  borderRightStyle?: any

  borderBottomColor?: any
  borderBottomWidth?: any
  borderBottomStyle?: any
}

type InlineStyles = {
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  fontFamily?: any
  fontSize?: CSSLength | CSSPercentage
  textDecoration?:
    | 'underline'
    | 'line-through'
    | 'underline line-through'
    | 'line-through underline'
  verticalAlign?: 'sub' | 'super'
  color?: any
}

type Styles = BlockStyles & InlineStyles

type Fragment = {
  value: string
  styles: InlineStyles
}

type RichText = Fragment[]

type Hyperlink = {
  type: 'external' | 'internal'
  link: string
}

type Cell = {
  value?: string | RichText
  formula?: string
  hyperlink?: Hyperlink
}

type Columns = {
  [key: number]: Cell
}

type Rows = {
  [key: number]: Columns
}

type Sheet = {
  data: Rows

  selectionArea?: Area
  stagnantSelectionAreas: Area[]

  sheetName: string
  position: Position

  isEditMode: boolean

  rowCount: number
  columnCount: number

  columnWidths: Array<number>
  rowHeights: Array<number>

  freezeColumnCount: number
  freezeRowCount: number

  error: Error
}

type InactiveSheets = {
  [key: string]: Sheet
}

type ExcelState = Sheet & { inactiveSheets: InactiveSheets }

export default ExcelState

// export default interface ExcelState {
//   name: string
//   // activeCellInputData: {
//   //   cellEditor: createEmptyEditor(),
//   //   formulaEditor: createEmptyEditor(),
//   //   cellValue: createEmptyEditorValue(),
//   //   formulaValue: createEmptyEditorValue()
//   // },
//   activeCellDialog: null,
//   activeSheetName: "Sheet1",
//   activeSelectionArea: null,
//   activeCellPosition: { x: 1, y: 1 },
//   activeCellSelectionAreaIndex: -1,
//   isSheetFocused: true,
//   rowResizeData: null,
//   columnResizeData: null,
//   freezeRowResizeData: null,
//   freezeColumnResizeData: null,
//   stagnantSelectionAreas: [],
//   selectedRows: {},
//   selectedColumns: {},
//   sheetNames: [],
//   scrollData: {
//     horizontalScrollDirection: "forward",
//     scrollLeft: 0,
//     scrollTop: 0,
//     scrollUpdateWasRequested: false,
//     verticalScrollDirection: "forward"
//   },
//   cursorType: "default",

//   isSelectionMode: false,
//   isEditMode: false,
//   isColumnResizeMode: false,
//   isFreezeColumnResizeMode: false,
//   isRowResizeMode: false,
//   isFreezeRowResizeMode: false,
//   sheetCellData: {},
//   sheetColumnCount: {},
//   sheetColumnWidths: {},
//   sheetFreezeColumnCount: 0,
//   sheetRowCount: {},
//   sheetRowHeights: {},
//   sheetFreezeRowCount: 0,
//   sheetHiddenColumns: {},
//   sheetHiddenRows: {},

//   inactiveSheets: {},

//   contextMenuData: { isOpen: false, anchorPosition: null },
//   isTemplatePublished: false,
//   templateId: "",
//   bundleId: ""
// };
