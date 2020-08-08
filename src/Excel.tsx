import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import { ExcelRouter, ExcelContent } from './Content'
import store from './redux/redux'
import { ExcelComponentProps } from './@types/components'

export const Excel: FunctionComponent<ExcelComponentProps> = ({
  initialState,
  style,
  isRouted,
  isToolBarDisabled,
  returnLink,
  handleSave,
}) => (
  <Provider store={store}>
    {isRouted ? (
      <ExcelRouter
        style={style}
        isToolBarDisabled={isToolBarDisabled}
        initialState={initialState}
        returnLink={returnLink}
        handleSave={handleSave}
      />
    ) : (
      <ExcelContent
        style={style}
        isToolBarDisabled={isToolBarDisabled}
        initialState={initialState}
        returnLink={returnLink}
        handleSave={handleSave}
      />
    )}
  </Provider>
)

export default Excel
