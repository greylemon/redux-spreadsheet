import { IExcelState, ISheet, ISheetsMap } from '../../@types/state'
import IRootStore from '../../@types/store'
import {
  SHEET_ROW_COUNT,
  SHEET_COLUMN_COUNT,
  SHEET_FREEZE_COLUMN_COUNT,
  SHEET_FREEZE_ROW_COUNT,
  SHEET_NAME,
  SHEET_NAMES,
} from '../../constants/defaults'
import { EditorState } from 'draft-js'

export const createRootStoreFromExcelState = (
  state: IExcelState
): IRootStore => ({
  present: state,
  history: [],
  index: 0,
})

export const createSheetState = (): ISheet => ({
  rowCount: SHEET_ROW_COUNT,
  columnCount: SHEET_COLUMN_COUNT,

  columnWidths: {},
  rowHeights: {},

  freezeColumnCount: SHEET_FREEZE_COLUMN_COUNT,
  freezeRowCount: SHEET_FREEZE_ROW_COUNT,
  hiddenColumns: {},
  hiddenRows: {},

  activeCellPosition: { x: 1, y: 1 },

  inactiveSelectionAreas: [],

  data: {},
})

export const createSheetsMap = (): ISheetsMap => ({
  [SHEET_NAME]: createSheetState(),
})

export const createInitialExcelState = (): IExcelState => ({
  sheetNames: SHEET_NAMES,

  name: '',

  isEditMode: false,
  isSheetNavigationOpen: false,
  isSheetNameEdit: false,
  isSelectionMode: false,

  editorState: EditorState.createEmpty(),
  activeSheetName: SHEET_NAME,

  error: {},

  selectionAreaIndex: -1,
  activeCellPosition: { x: 1, y: 1 },
  inactiveSelectionAreas: [],

  sheetsMap: createSheetsMap(),

  dependentReferences: {},
  independentReferences: {},
  results: {},
  sheetNameText: '',
})
