import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  KeyboardEvent,
  useRef,
} from 'react'

import './styles/styles.scss'

import { Route, useRouteMatch, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Divider } from '@material-ui/core'
// import { VariableSizeGrid } from 'react-window'
// import SheetContainer from './components/sheet/Sheet'
import ToolBar from './components/toolBar/ToolBar'
import SheetNavigation from './components/sheetNavigation/SheetNavigation'
// import FormulaBar from './components/formulaBar/FormulaBar'
import { ExcelActions } from './redux/store'
import { ExcelComponentProps } from './@types/components'
import { THUNK_COMMAND_SAVE } from './redux/thunks/IO'
import {
  // THUNK_MOUSE_MOVE,
  THUNK_MOUSE_UP,
  // THUNK_MOUSE_DOWN,
} from './redux/thunks/mouse'
import { THUNK_HISTORY_UNDO, THUNK_HISTORY_REDO } from './redux/thunks/history'
import AppBar from './components/appBar/AppBar'
import { STYLE_EXCEL } from './style'
// import ScrollListener from './components/ScrollListener'
import CanvasSheet from './components/canvas_sheet/Sheet'

export const ExcelContent: FunctionComponent<ExcelComponentProps> = ({
  style,
  isRouted,
  initialState,
  isToolBarDisabled,
  returnLink,
  handleSave,
}) => {
  // const gridRef = useRef<VariableSizeGrid>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
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
          case 'Y':
          case 'y':
            dispatch(THUNK_HISTORY_REDO())
            break
          case 'Z':
          case 'z':
            dispatch(THUNK_HISTORY_UNDO())
            break
          case 'S':
          case 's':
            if (handleSave) dispatch(THUNK_COMMAND_SAVE(handleSave))
            event.preventDefault()
            break
          default:
            break
        }
      }
    },
    [dispatch, handleSave]
  )

  // window.onmousemove = useCallback(
  //   ({ clientX, clientY, shiftKey, ctrlKey }: MouseEvent) => {
  //     dispatch(THUNK_MOUSE_MOVE({ x: clientX, y: clientY }, shiftKey, ctrlKey))
  //   },
  //   [dispatch]
  // )

  // window.ontouchmove = useCallback(
  //   ({ touches }: TouchEvent) => {
  //     const { clientX, clientY } = touches[0]
  //     dispatch(THUNK_MOUSE_MOVE({ x: clientX, y: clientY }))
  //   },
  //   [dispatch]
  // )

  window.onmouseup = useCallback(() => {
    dispatch(THUNK_MOUSE_UP())
  }, [dispatch])

  // window.ontouchend = useCallback(() => {
  //   dispatch(THUNK_MOUSE_UP())
  // }, [dispatch])

  useEffect(() => {
    return () => {
      delete window.onmousedown
      delete window.onmouseup
      delete window.ontouchmove
      delete window.ontouchend
      delete window.ondblclick
      delete window.ontouchstart
    }
  }, [])

  return (
    <div
      className="excel"
      style={{ ...STYLE_EXCEL, ...style }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <AppBar
        sheetRef={sheetRef}
        handleSave={handleSave}
        returnLink={returnLink}
      />
      <Divider />
      {!isToolBarDisabled && <ToolBar />}
      {/* <FormulaBar /> */}
      {/* <SheetContainer gridRef={gridRef} sheetRef={sheetRef} /> */}
      <CanvasSheet />
      <Divider />
      <SheetNavigation isRouted={isRouted} />
      {/* <ScrollListener gridRef={gridRef} /> */}
    </div>
  )
}

const ExcelRoute: FunctionComponent<Partial<ExcelComponentProps>> = ({
  style,
  initialState,
  isToolBarDisabled,
  returnLink,
  handleSave,
}) => {
  const dispatch = useDispatch()
  const {
    params: { activeSheetName },
  } = useRouteMatch()

  useEffect(() => {
    dispatch(ExcelActions.CHANGE_SHEET(activeSheetName))
  }, [activeSheetName])

  useEffect(() => {
    return () => {
      dispatch(ExcelActions.CLEAR_STATE())
    }
  }, [dispatch])

  return (
    <ExcelContent
      style={style}
      initialState={initialState}
      isToolBarDisabled={isToolBarDisabled}
      handleSave={handleSave}
      returnLink={returnLink}
      isRouted
    />
  )
}

export const ExcelRouter: FunctionComponent<Partial<ExcelComponentProps>> = ({
  initialState,
  style,
  isToolBarDisabled,
  handleSave,
  returnLink,
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
            returnLink={returnLink}
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
            returnLink={returnLink}
            handleSave={handleSave}
          />
        )}
      />
    </Switch>
  )
}

export default ExcelRouter
