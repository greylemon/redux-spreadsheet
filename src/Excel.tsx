import React, { FunctionComponent, CSSProperties } from 'react'
import { Provider } from 'react-redux'
import './index.scss'
import { ExcelRouter, ExcelContent } from './Content'
import store from './redux/redux'
import { IHandleSave } from './@types/functions'

export const Excel: FunctionComponent<{
  /** Inline react styles */
  style?: CSSProperties
  /** Determines whether Excel uses react-router */
  isRouted?: boolean
  /** Function to process save events */
  handleSave?: IHandleSave
}> = ({ style, isRouted, handleSave }) => (
  <Provider store={store}>
    {isRouted ? (
      <ExcelRouter style={style} handleSave={handleSave} />
    ) : (
      <ExcelContent style={style} handleSave={handleSave} />
    )}
  </Provider>
)

export default Excel
