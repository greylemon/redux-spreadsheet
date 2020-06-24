import { EditorState } from 'draft-js'
import { IExcelState } from './state'

export type IItemData = {
  data: IRows
  columnWidthsAdjusted: IColumnWidthsAdjusted
  getRowHeight: (index: number) => number
}

export interface ICellProps {
  data: IItemData
  style: CSSProperties
  columnIndex: IColumnIndex
  rowIndex: IRowIndex
}

export interface IActiveCellProps {
  computeActiveCellStyle?: IComputeActiveCellStyle
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
}

export interface IEditorCellProps {
  style: CSSProperties
}

export interface INormalActiveCellProps {
  style: CSSProperties
}

export interface ICommonPaneProps {
  checkIsActiveCellInCorrectPane: ICheckIsActiveCellInCorrectPane
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  computeActiveCellStyle?: IComputeActiveCellStyle
}

export interface ISelectionAreaProps {
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
}

export interface IInactiveSelectionAreasComponentsProps {
  inactiveSelectionAreasStyle: Array<CSSProperties>
}

export interface IInactiveSelectionAreasProps {
  computeSelectionAreaStyle: IComputeSelectionAreaStyle
  checkIsAreaInRelevantPane: ICheckIsAreaInRelevantPane
}


export interface IComputeActiveCellStyle {
  (
    position: IPosition,
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
    freezeRowCount: IFreezeRowCount,
    data: IRows
  ): CSSProperties
}

export interface IComputeSelectionAreaStyle {
  (
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    selectionArea?: ISelectionArea
  ): CSSProperties
}

export interface ICheckIsAreaInRelevantPane {
  (
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    area?: ISelectionArea
  ): boolean
}

export interface ICheckIsActiveCellInCorrectPane {
  (
    position: IPosition,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}

export type IInlineStylesRange = { [key: string]: IRange[] }


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

export type IRichText = IRichTextBlock[]

export type IValue = string | IRichText

export type IHyperlink = {
  type: 'external' | 'internal'
  link: string
}

export type ICell = {
  value?: IValue
  formula?: string
  hyperlink?: IHyperlink
  merged?: IArea
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

export type IExcelComponent = JSX.Element
