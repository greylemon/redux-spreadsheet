import { createSlice } from '@reduxjs/toolkit'
import ExcelState from './types'

const initialState: ExcelState = {
  data: {},

  // selectionArea?:
  stagnantSelectionAreas: [],

  sheetName: '',
  position: { x: 1, y: 1 },

  isEditMode: false,

  rowCount: 201,
  columnCount: 27,

  columnWidths: [],
  rowHeights: [],

  freezeColumnCount: 0,
  freezeRowCount: 0,

  inactiveSheets: {},

  error: {},
}

const ExcelStore = createSlice({
  name: 'excel',
  initialState,
  reducers: {
    sample_action: (state: ExcelState, action: any) => {
      return {
        data: {},

        // selectionArea?:
        stagnantSelectionAreas: [],

        sheetName: '',
        position: { x: 1, y: 1 },

        isEditMode: false,

        rowCount: 201,
        columnCount: 27,

        columnWidths: [],
        rowHeights: [],

        freezeColumnCount: 0,
        freezeRowCount: 0,

        inactiveSheets: {},

        error: {},
      }
    },
  },
})

export default ExcelStore
