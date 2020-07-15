import React, { FunctionComponent, useEffect } from 'react'

import './styles/styles.scss'

import WindowMouseListener from './components/WindowMouseListener'
import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
// import FormulaBar from './components/formulaBar/FormulaBar'
import { Route, useRouteMatch, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ExcelActions } from './redux/store'
import { ExcelComponentProps } from './@types/components'
import WindowKeyboardListener from './components/WindowKeyboardListener'

export const ExcelContent: FunctionComponent<ExcelComponentProps> = ({
  style,
  isRouted,
  initialState,
  handleSave,
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (initialState) dispatch(ExcelActions.UPDATE_STATE(initialState))
  }, [dispatch, initialState])

  return (
    <div className="excel" style={style}>
      <ToolBar />
      {/* <FormulaBar /> */}
      <SheetContainer />
      <SheetNavigation isRouted={isRouted} />
      <WindowMouseListener />
      <WindowKeyboardListener handleSave={handleSave} />
    </div>
  )
}

const ExcelRoute: FunctionComponent<Partial<ExcelComponentProps>> = ({
  style,
  initialState,
  handleSave,
}) => {
  const dispatch = useDispatch()
  const {
    params: { activeSheetName },
  } = useRouteMatch()

  useEffect(() => {
    dispatch(ExcelActions.CHANGE_SHEET(activeSheetName))
  }, [activeSheetName])

  return (
    <ExcelContent
      style={style}
      initialState={initialState}
      handleSave={handleSave}
      isRouted
    />
  )
}

export const ExcelRouter: FunctionComponent<Partial<ExcelComponentProps>> = ({
  initialState,
  style,
  handleSave,
}) => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route
        exact
        path={url}
        render={() => (
          <ExcelContent
            style={style}
            initialState={initialState}
            handleSave={handleSave}
            isRouted
          />
        )}
      />
      <Route
        exact
        path={`${url}${url === '/' ? '' : '/'}:activeSheetName`}
        render={() => (
          <ExcelRoute
            style={style}
            initialState={initialState}
            handleSave={handleSave}
          />
        )}
      />
    </Switch>
  )
}

export default ExcelRouter
