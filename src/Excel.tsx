import React, { FunctionComponent, CSSProperties } from 'react'
import { Provider } from 'react-redux'
import './index.scss'
import { ExcelRouter, ExcelContent } from './Content'
import store from './redux/redux'

export const Excel: FunctionComponent<{
  style?: CSSProperties
  isRouted?: boolean
}> = ({ style, isRouted }) => (
  <Provider store={store}>
    {isRouted ? <ExcelRouter style={style} /> : <ExcelContent style={style} />}
  </Provider>
)

export default Excel
