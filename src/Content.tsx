import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  KeyboardEvent,
} from 'react'

import './styles/styles.scss'

import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
// import FormulaBar from './components/formulaBar/FormulaBar'
import { Route, useRouteMatch, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ExcelActions } from './redux/store'
import { ExcelComponentProps } from './@types/components'
import {
  saveWorkbook,
  customUndo,
  customRedo,
  customMouseUp,
  customMouseMove,
} from './redux/thunk'

export const ExcelContent: FunctionComponent<ExcelComponentProps> = ({
  style,
  isRouted,
  initialState,
  isToolBarDisabled,
  handleSave,
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (initialState) dispatch(ExcelActions.UPDATE_STATE(initialState))
  }, [dispatch, initialState])

  // Distinguish text submit from mouse move?
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key } = event

      if (ctrlKey || metaKey) {
        switch (key) {
          case 'y':
            dispatch(customRedo())
            break
          case 'z':
            dispatch(customUndo())
            break
          case 's':
            if (handleSave) dispatch(saveWorkbook(handleSave))
            event.preventDefault()
            break
          case 'a':
            dispatch(ExcelActions.SELECT_ALL())
            break
        }
      }
    },
    [dispatch, customRedo, customUndo, handleSave]
  )

  window.onmousemove = useCallback(
    (event: MouseEvent) => {
      switch (event.buttons) {
        case 1:
          dispatch(customMouseMove({ x: event.clientX, y: event.clientY }))
          break
      }
    },
    [dispatch]
  )

  window.onmouseup = useCallback(() => {
    dispatch(customMouseUp())
  }, [dispatch])

  useEffect(() => {
    return () => {
      delete window.onmousedown
      delete window.onmouseup
    }
  }, [])

  return (
    <div
      className="excel"
      style={style}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {!isToolBarDisabled && <ToolBar />}
      {/* <FormulaBar /> */}
      <SheetContainer />
      <SheetNavigation isRouted={isRouted} />
    </div>
  )
}

const ExcelRoute: FunctionComponent<Partial<ExcelComponentProps>> = ({
  style,
  initialState,
  isToolBarDisabled,
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
      isToolBarDisabled={isToolBarDisabled}
      handleSave={handleSave}
      isRouted
    />
  )
}

export const ExcelRouter: FunctionComponent<Partial<ExcelComponentProps>> = ({
  initialState,
  style,
  isToolBarDisabled,
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
            isToolBarDisabled={isToolBarDisabled}
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
            isToolBarDisabled={isToolBarDisabled}
            initialState={initialState}
            handleSave={handleSave}
          />
        )}
      />
    </Switch>
  )
}

export default ExcelRouter
