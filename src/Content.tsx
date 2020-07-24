import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  KeyboardEvent,
} from 'react'

import './styles/styles.scss'

import { Route, useRouteMatch, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
// import FormulaBar from './components/formulaBar/FormulaBar'
import { ExcelActions } from './redux/store'
import { ExcelComponentProps } from './@types/components'
import { THUNK_COMMAND_SAVE } from './redux/thunks/IO'
import { THUNK_MOUSE_UP, THUNK_MOUSE_MOVE } from './redux/thunks/mouse'
import { THUNK_HISTORY_UNDO, THUNK_HISTORY_REDO } from './redux/thunks/history'
import AppBar from './components/appBar/AppBar'
import { Divider } from '@material-ui/core'

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
            dispatch(THUNK_HISTORY_REDO())
            break
          case 'z':
            dispatch(THUNK_HISTORY_UNDO())
            break
          case 's':
            if (handleSave) dispatch(THUNK_COMMAND_SAVE(handleSave))
            event.preventDefault()
            break
          default:
            break
        }
      }
    },
    [dispatch, THUNK_HISTORY_REDO, THUNK_HISTORY_UNDO, handleSave]
  )

  window.onmousemove = useCallback(
    (event: MouseEvent) => {
      switch (event.buttons) {
        case 1:
          dispatch(THUNK_MOUSE_MOVE({ x: event.clientX, y: event.clientY }))
          break
        default:
          break
      }
    },
    [dispatch]
  )

  window.onmouseup = useCallback(() => {
    dispatch(THUNK_MOUSE_UP())
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
      <AppBar />
      <Divider />
      {!isToolBarDisabled && <ToolBar />}
      {/* <FormulaBar /> */}
      <SheetContainer />
      <Divider />
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
