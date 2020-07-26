import { FunctionComponent } from 'react'
import { IExcelState } from './src/@types/state'
import { ExcelComponentProps } from './src/@types/components'

declare module 'redux-spreadsheet' {
  const Excel: FunctionComponent<ExcelComponentProps>
  function updateWorkbookReference(state: IExcelState): IExcelState
}
