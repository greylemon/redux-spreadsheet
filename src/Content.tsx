import React, { FunctionComponent, CSSProperties, useEffect } from 'react'

import './styles/styles.scss'

import WindowListener from './components/WindowListener'
import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
// import FormulaBar from './components/formulaBar/FormulaBar'
import { Route, useRouteMatch, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ExcelActions } from './redux/store'

export const ExcelContent: FunctionComponent<{ style?: CSSProperties, isRouted?: boolean }> = ({
  style,
  isRouted,
}) => (
  <div className="excel" style={style}>
    <ToolBar />
    {/* <FormulaBar /> */}
    <SheetContainer />
    <SheetNavigation isRouted={isRouted} />
    <WindowListener />
  </div>
)

const ExcelRoute: FunctionComponent<{ style?: CSSProperties }> = ({
  style,
}) => {
  const dispatch = useDispatch()
  const {
    params: { activeSheetName },
  } = useRouteMatch()

  useEffect(() => {
    dispatch(ExcelActions.CHANGE_SHEET(activeSheetName))
  }, [activeSheetName])

  return <ExcelContent style={style} isRouted />
}

export const ExcelRouter: FunctionComponent<{ style?: CSSProperties }> = ({
  style,
}) => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={url} render={() => <ExcelContent style={style} isRouted />} />
      <Route
        exact
        path={`${url}${url === '/' ? '' : '/'}:activeSheetName`}
        render={() => <ExcelRoute style={style} />}
      />
    </Switch>
  )
}

export default ExcelRouter
