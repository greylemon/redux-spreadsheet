import React from 'react'
import { EditorState } from 'draft-js'
import { Excel } from '../src/Excel'
import { IExcelState } from '../src/@types/state'
import frozenState from '../samples/frozen.json'
import { initialExcelState } from '../src/redux/store'
import { selectExcel } from '../src/redux/selectors/base'
import { updateWorkbookReference } from '../src/tools/formula/formula'

const initialState: IExcelState = updateWorkbookReference({
  ...initialExcelState,
  ...selectExcel(JSON.parse(JSON.stringify(frozenState))),
  cellEditorState: EditorState.createEmpty(),
})

const Frozen: any = () => <Excel key="frozen" initialState={initialState} />

export default Frozen
