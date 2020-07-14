import { IExcelState } from './src/@types/state'

declare module 'redux-spreadsheet' {
  function Excel(): JSX.Element
  function updateWorkbookReference(state: IExcelState): IExcelState
}
