import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import './index.scss'
import { ExcelRouter, ExcelContent } from './Content'
import store from './redux/redux'
import { ExcelComponentProps } from './@types/components'

export const Excel: FunctionComponent<ExcelComponentProps> = ({
  initialState,
  style,
  isRouted,
  handleSave,
}) => (
  <Provider store={store}>
    {isRouted ? (
      <ExcelRouter
        style={style}
        initialState={initialState}
        handleSave={handleSave}
      />
    ) : (
      <ExcelContent
        style={style}
        initialState={initialState}
        handleSave={handleSave}
      />
    )}
  </Provider>
)

export default Excel
