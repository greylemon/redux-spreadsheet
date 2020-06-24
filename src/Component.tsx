import React from 'react'
import { Provider } from 'react-redux'
import './index.scss'
import Excel from './Excel'
import store from './redux/redux'

export const ExcelComponent = () => (
  <Provider store={store}>
    <Excel />
  </Provider>
)

export default ExcelComponent
