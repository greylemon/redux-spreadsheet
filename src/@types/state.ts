import { EditorState } from 'draft-js'

export type IPosition = { x: number; y: number }

export type IArea = { start: IPosition; end: IPosition }

export type IRange = { start: number; end: number }

export type IAreaRange = {
  xRange: IRange
  yRange: IRange
}

export type IColumnWidthsAdjusted = number[]

export type IError = object

export type ICSSLength = number | string
export type ICSSPercentage = string

export type IBlockStyles = {
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

export type IInlineStyles = {
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  fontFamily?: any
  fontSize?: ICSSLength | ICSSPercentage
  textDecoration?:
    | 'underline'
    | 'line-through'
    | 'underline line-through'
    | 'line-through underline'
  verticalAlign?: 'sub' | 'super'
  color?: any
}

export type IStyles = IBlockStyles & IInlineStyles

export type IFragment = {
  key?: string
  text?: string
  styles?: IInlineStyles
}

export type IRichTextBlock = {
  key?: string
  fragments: IFragment[]
}

export type IRichTextValue = IRichTextBlock[]

export type IFormulaValue = {
  formula?: string
  result?: string
}

export type IValue = string | IRichTextValue | IFormulaValue

export type IHyperlink = {
  type: 'external' | 'internal'
  link: string
}

export type ICell = {
  value?: IValue
  hyperlink?: IHyperlink
  merged?: IArea
  type?: string
}

export type IOffset = number
export type IRowOffsets = Array<IOffset>
export type IColumnOffsets = Array<IOffset>

export type IColumns = { [key: number]: ICell }

export type IRows = { [key: number]: IColumns }

export type IColumnIndex = number
export type IRowIndex = number

export type IGridMeasurements<T> = { [key: number]: T }

export type IColumnWidth = number
export type IColumnWidths = IGridMeasurements<IColumnWidth>

export type IRowheight = number
export type IRowHeights = IGridMeasurements<IRowheight>

export type IRowCount = number
export type IColumnCount = number
export type IFreezeColumnCount = number
export type IFreezeRowCount = number

export type IIsEditMode = boolean

export type IActiveCellPosition = IPosition

export type IStagnantSelectionAreas = IArea[]

export type ISelectionArea = IArea
export type IInactiveSelectionAreas = Array<IArea>

export type ISelectionAreaIndex = number

export type IEditorState = EditorState
export type ISheetName = string
export type ISheetNames = ISheetName[]
export type IName = string

export type ISheet = {
  data: IRows

  inactiveSelectionAreas: IInactiveSelectionAreas

  activeCellPosition: IActiveCellPosition
  selectionArea?: ISelectionArea

  selectionAreaIndex: ISelectionAreaIndex

  rowCount: IRowCount
  columnCount: IColumnCount

  columnWidths: IColumnWidths
  rowHeights: IRowHeights

  freezeColumnCount: IFreezeColumnCount
  freezeRowCount: IFreezeRowCount
}

export type ISheetsMap = {
  [key: string]: ISheet
}

export type IExcelState = {
  name: IName
  activeSheetName: ISheetName
  sheetNames: ISheetNames
  sheetsMap: ISheetsMap
  isEditMode: IIsEditMode
  editorState: IEditorState
  error: IError
}