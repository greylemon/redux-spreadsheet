import React, {
  useCallback,
  FunctionComponent,
  useRef,
  RefObject,
  KeyboardEvent,
  useMemo,
} from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { shallowEqual, useDispatch } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add'
import {
  Button,
  MenuList,
  Popper,
  Paper,
  ClickAwayListener,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'
import {
  ISheetName,
  IIsSheetNavigationOpen,
  IIsSheetEditText,
} from '../../@types/state'
import { useTypedSelector } from '../../redux/redux'
import {
  selectSheetNames,
  selectActiveSheetName,
  selectIsSheetNavigationOpen,
  selectIsSheetNameEdit,
  selectSheetNameText,
} from '../../redux/selectors/base'
import { ExcelActions } from '../../redux/store'
import { IHandleSheetPress } from '../../@types/functions'
import STYLE_SHEET_NAVIGATION, {
  STYLE_SHEET_NAVIGATION_CONTAINER,
  STYLE_SHEET_NAVIGATION_CONTAINER_ACTIVE,
  STYLE_SHEET_NAVIGATION_CONTAINER_INACTIVE,
  STYLE_SHEET_NAVIGATION_SHEETS,
  STYLE_SHEET_NAVIGATION_ADD_SHEET,
  STYLE_SHEET_NAVIGATION_OPTIONS,
  STYLE_SHEET_NAVIGATION_OPTION,
  STYLE_SHEET_NAVIGATION_SHEET_SHEETNAME,
  STYLE_SHEET_OPTIONS,
} from './style'
import { THUNK_RENAME_SHEET, THUNK_ADD_SHEET } from '../../redux/thunks/sheet'

const SheetOptionButton: FunctionComponent<{
  isActive: boolean
  isSheetNavigationOpen: boolean
}> = ({ isActive, isSheetNavigationOpen }) => {
  const dispatch = useDispatch()

  const handleMouseDown = useCallback(() => {
    if (isActive) {
      if (isSheetNavigationOpen) {
        dispatch(ExcelActions.CLOSE_SHEET_NAVIGATION_OPTION())
      } else {
        dispatch(ExcelActions.OPEN_SHEET_NAVIGATION_OPTION())
      }
    }
  }, [dispatch, isActive, isSheetNavigationOpen])

  return (
    <Button
      style={STYLE_SHEET_NAVIGATION_OPTION}
      disabled={!isActive}
      onMouseDown={handleMouseDown}
    >
      <ArrowDropDown style={{ color: isActive ? 'green' : 'gray' }} />
    </Button>
  )
}

const SheetItemContent: FunctionComponent<{
  sheetName: ISheetName
  isActiveSheet: boolean
  isSheetNavigationOpen: IIsSheetNavigationOpen
}> = ({ sheetName, isActiveSheet, isSheetNavigationOpen }) => {
  const dispatch = useDispatch()

  const handleDoubleClick = useCallback(() => {
    if (isActiveSheet) {
      dispatch(ExcelActions.ENABLE_SHEET_NAME_EDIT())
    }
  }, [dispatch, isActiveSheet])

  return (
    <div>
      <span
        style={STYLE_SHEET_NAVIGATION_SHEET_SHEETNAME}
        onDoubleClick={handleDoubleClick}
      >
        {sheetName}
      </span>
      <SheetOptionButton
        isActive={isActiveSheet}
        isSheetNavigationOpen={isSheetNavigationOpen}
      />
    </div>
  )
}

const SheetOption: FunctionComponent<{
  anchorRef: RefObject<HTMLLIElement>
  isSheetNavigationOpen: IIsSheetNavigationOpen
}> = ({ anchorRef, isSheetNavigationOpen }) => {
  const dispatch = useDispatch()

  const sheetNames = useTypedSelector(
    (state) => selectSheetNames(state),
    shallowEqual
  )

  const handleClickAway = useCallback(
    (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) return

      dispatch(ExcelActions.CLOSE_SHEET_NAVIGATION_OPTION())
    },
    [dispatch, anchorRef]
  )

  const handleClose = useCallback(() => {
    dispatch(ExcelActions.CLOSE_SHEET_NAVIGATION_OPTION())
  }, [dispatch])

  const handleDeleteSheet = useCallback(() => {
    handleClose()
    dispatch(ExcelActions.DELETE_SHEET())
  }, [dispatch, handleClose])

  const handleStartEdit = useCallback(() => {
    handleClose()
    dispatch(ExcelActions.ENABLE_SHEET_NAME_EDIT())
  }, [dispatch, handleClose])

  return (
    <Popper
      open={isSheetNavigationOpen}
      anchorEl={anchorRef.current}
      placement="top-start"
    >
      <Paper style={STYLE_SHEET_OPTIONS}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <MenuList
            autoFocusItem={isSheetNavigationOpen}
            id="menu-list-grow"
            tabIndex={undefined}
          >
            <MenuItem
              onClick={handleDeleteSheet}
              disabled={sheetNames.length === 1}
            >
              Delete
            </MenuItem>
            <MenuItem onClick={handleStartEdit}>Rename</MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Popper>
  )
}

const NormalSheetItem: FunctionComponent<{
  sheetName: ISheetName
  isSheetNavigationOpen: IIsSheetNavigationOpen
  handleSheetPress: IHandleSheetPress
  isActiveSheet: boolean
  anchorRef: RefObject<HTMLLIElement>
}> = ({ sheetName, anchorRef, isActiveSheet, isSheetNavigationOpen }) => (
  <>
    <SheetItemContent
      isSheetNavigationOpen={isSheetNavigationOpen}
      sheetName={sheetName}
      isActiveSheet={isActiveSheet}
    />
    {isActiveSheet && anchorRef.current && (
      <SheetOption
        anchorRef={anchorRef}
        isSheetNavigationOpen={isSheetNavigationOpen}
      />
    )}
  </>
)

const SheetEditText: FunctionComponent = () => {
  const dispatch = useDispatch()
  const sheetNameEditText = useTypedSelector(
    (state) => selectSheetNameText(state),
    shallowEqual
  )

  const handleChange = useCallback(
    ({ target: { value } }) => {
      dispatch(ExcelActions.CHANGE_SHEET_NAME_TEXT(value))
    },
    [dispatch]
  )

  const handleChangeActiveSheetName = useCallback(() => {
    dispatch(THUNK_RENAME_SHEET())
  }, [dispatch])

  const handleKeyDown = useCallback(
    ({ key }: KeyboardEvent) => {
      switch (key) {
        case 'Enter':
          handleChangeActiveSheetName()
          break
        case 'Escape':
          dispatch(ExcelActions.RESET_SHEET_NAME_EDIT())
          break
        default:
          break
      }
    },
    [dispatch, handleChangeActiveSheetName]
  )

  return (
    <ClickAwayListener
      onClickAway={handleChangeActiveSheetName}
      mouseEvent="onMouseDown"
    >
      <TextField
        value={sheetNameEditText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        autoFocus
      />
    </ClickAwayListener>
  )
}

const SortableItem = SortableElement(
  ({
    activeSheetName,
    isSheetEditText,
    sheetName,
    isSheetNavigationOpen,
    handleSheetPress,
  }: {
    activeSheetName: ISheetName
    isSheetEditText: IIsSheetEditText
    sheetName: ISheetName
    isSheetNavigationOpen: IIsSheetNavigationOpen
    handleSheetPress: IHandleSheetPress
  }) => {
    const isActiveSheet = sheetName === activeSheetName

    const anchorRef = useRef<HTMLLIElement>(null)

    const handleMouseDown = useCallback(() => {
      if (!isActiveSheet) {
        handleSheetPress(sheetName)
      }
    }, [isActiveSheet, isSheetNavigationOpen, handleSheetPress])

    const style = useMemo(
      () => ({
        ...STYLE_SHEET_NAVIGATION_CONTAINER,
        ...(isActiveSheet
          ? STYLE_SHEET_NAVIGATION_CONTAINER_ACTIVE
          : STYLE_SHEET_NAVIGATION_CONTAINER_INACTIVE),
      }),
      [isActiveSheet]
    )

    return (
      <li
        role="navigation"
        ref={anchorRef}
        style={style}
        onMouseDown={handleMouseDown}
      >
        {isSheetEditText && isActiveSheet ? (
          <SheetEditText />
        ) : (
          <NormalSheetItem
            anchorRef={anchorRef}
            handleSheetPress={handleSheetPress}
            isActiveSheet={isActiveSheet}
            isSheetNavigationOpen={isSheetNavigationOpen}
            sheetName={sheetName}
          />
        )}
      </li>
    )
  }
)

const SortableList = SortableContainer(
  ({
    sheetNames,
    isSheetNavigationOpen,
    handleSheetPress,
  }: {
    sheetNames: string[]
    isSheetNavigationOpen: IIsSheetNavigationOpen
    handleSheetPress: IHandleSheetPress
  }) => {
    const { activeSheetName, isSheetEditText } = useTypedSelector(
      (state) => ({
        activeSheetName: selectActiveSheetName(state),
        isSheetEditText: selectIsSheetNameEdit(state),
      }),
      shallowEqual
    )

    return (
      <ul style={STYLE_SHEET_NAVIGATION_SHEETS}>
        {sheetNames.map((sheetName, index) => (
          <SortableItem
            key={`item-${sheetName}`}
            index={index}
            activeSheetName={activeSheetName}
            isSheetEditText={isSheetEditText}
            sheetName={sheetName}
            isSheetNavigationOpen={isSheetNavigationOpen}
            handleSheetPress={handleSheetPress}
            disabled={isSheetEditText}
          />
        ))}
      </ul>
    )
  }
)

const SheetAdder: FunctionComponent = () => {
  const dispatch = useDispatch()

  const handleAddSheet = useCallback(() => {
    dispatch(THUNK_ADD_SHEET())
  }, [dispatch])

  return (
    <Button style={STYLE_SHEET_NAVIGATION_ADD_SHEET} onClick={handleAddSheet}>
      <AddIcon fontSize="small" />
    </Button>
  )
}

const SheetSelector: FunctionComponent<{
  handleSheetPress: IHandleSheetPress
}> = () =>
  // {
  //   handleSheetPress
  // }
  {
    return <div />
  }

const SheetNavigationOptions: FunctionComponent<{
  handleSheetPress: IHandleSheetPress
}> = ({ handleSheetPress }) => (
  <div style={STYLE_SHEET_NAVIGATION_OPTIONS}>
    <SheetSelector handleSheetPress={handleSheetPress} />
    <SheetAdder />
  </div>
)

const HorizontalNavigation: FunctionComponent<{
  handleSheetPress: IHandleSheetPress
}> = ({ handleSheetPress }) => {
  const dispatch = useDispatch()
  const { sheetNames, isSheetNavigationOpen } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      isSheetNavigationOpen: selectIsSheetNavigationOpen(state),
    }),
    shallowEqual
  )

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex)
        dispatch(ExcelActions.CHANGE_SHEET_ORDER({ oldIndex, newIndex }))
    },
    [dispatch]
  )

  const handleSortStart = useCallback(() => {
    if (isSheetNavigationOpen)
      dispatch(ExcelActions.CLOSE_SHEET_NAVIGATION_OPTION())
  }, [dispatch, isSheetNavigationOpen])

  return (
    <SortableList
      axis="x"
      lockAxis="x"
      onSortEnd={handleSortEnd}
      sheetNames={sheetNames}
      isSheetNavigationOpen={isSheetNavigationOpen}
      handleSheetPress={handleSheetPress}
      onSortStart={handleSortStart}
      distance={1}
    />
  )
}

const SheetNavigation: FunctionComponent<{
  handleSheetPress: IHandleSheetPress
}> = ({ handleSheetPress }) => (
  <div style={STYLE_SHEET_NAVIGATION}>
    <SheetNavigationOptions handleSheetPress={handleSheetPress} />
    <HorizontalNavigation handleSheetPress={handleSheetPress} />
  </div>
)

const RoutedSheetNavigation = () => {
  const history = useHistory()
  const { params, url } = useRouteMatch<{ activeSheetName: ISheetName }>()

  const handleSheetPress = useCallback(
    (sheetName) => {
      const { activeSheetName } = params
      if (sheetName !== activeSheetName) {
        history.push(activeSheetName ? sheetName : `${url}/${sheetName}`)
      }
    },
    [history, params, url]
  )

  return <SheetNavigation handleSheetPress={handleSheetPress} />
}

const NonRoutedSheetNavigation = () => {
  const dispatch = useDispatch()

  const handleSheetPress = useCallback(
    (sheetName) => {
      dispatch(ExcelActions.CHANGE_SHEET(sheetName))
    },
    [dispatch]
  )

  return <SheetNavigation handleSheetPress={handleSheetPress} />
}

const SheetNavigationContainer: FunctionComponent<{ isRouted?: boolean }> = ({
  isRouted,
}) => (isRouted ? <RoutedSheetNavigation /> : <NonRoutedSheetNavigation />)

export default SheetNavigationContainer
