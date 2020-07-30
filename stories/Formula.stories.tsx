import React from 'react'
import { EditorState } from 'draft-js'
import { Excel } from '../src/Excel'
import { IExcelState } from '../src/@types/state'
import formulaState from '../samples/formulas.json'
import { initialExcelState } from '../src/redux/store'
import { selectExcel } from '../src/redux/selectors/base'
import { updateWorkbookReference } from '../src/tools/formula/formula'

const initialState: IExcelState = updateWorkbookReference({
  ...initialExcelState,
  ...selectExcel(JSON.parse(JSON.stringify(formulaState))),
  cellEditorState: EditorState.createEmpty(),
})

const Formulas: any = () => <Excel key="formula" initialState={initialState} />

export default Formulas
