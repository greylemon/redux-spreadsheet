import React from 'react'
import { EditorState } from 'draft-js'
import { Excel } from '../src/Excel'
import { IExcelState } from '../src/@types/state'
import formulaState from '../samples/formulas.json'
import { initialExcelState } from '../src/redux/store'
import { updateWorkbookReference } from '../src/tools/formula'
import { selectExcel } from '../src/redux/selectors/base'

const initialState: IExcelState = updateWorkbookReference({
  ...initialExcelState,
  ...selectExcel(JSON.parse(JSON.stringify(formulaState))),
  editorState: EditorState.createEmpty(),
})

const Formulas: any = () => <Excel key="formula" initialState={initialState} />

export default Formulas
