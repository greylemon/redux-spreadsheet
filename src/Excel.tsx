import React, { FunctionComponent, CSSProperties } from 'react'
import { Provider } from 'react-redux'
import './index.scss'
import ExcelContent from './Content'
import store from './redux/redux'

export const Excel: FunctionComponent<{ style?: CSSProperties }> = ({
  style,
}) => (
  <Provider store={store}>
    <ExcelContent style={style} />
  </Provider>
)

export default Excel
