import React from 'react'
import { Excel } from '../src/Excel'
import { IExcelState } from '../src/@types/state'
import formulaState from '../samples/formulas.json'
import { EditorState } from 'draft-js'
import { initialExcelState } from '../src/redux/store'
import { selectExcel } from '../src/redux/selectors'

const initialState: IExcelState = {
  ...initialExcelState,
  ...selectExcel(JSON.parse(JSON.stringify(formulaState))),
  editorState: EditorState.createEmpty(),
}

export const Formulas: any = () => <Excel initialState={initialState} />
