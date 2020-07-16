import React, {
  useCallback,
  FunctionComponent,
  useRef,
  RefObject,
  Fragment,
} from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { ISheetName, IIsSheetNavigationOpen } from '../../@types/state'
import { useTypedSelector } from '../../redux/redux'
import {
  selectSheetNames,
  selectActiveSheetName,
  selectIsSheetNavigationOpen,
} from '../../redux/selectors'
import { shallowEqual, useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/store'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { IHandleSheetPress } from '../../@types/functions'
import AddIcon from '@material-ui/icons/Add'
import {
  Button,
  MenuList,
  Popper,
  Paper,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'

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
      className="sheetNavigationSheet__option"
      size="small"
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
}> = ({ sheetName, isActiveSheet, isSheetNavigationOpen }) => (
  <div className="sheetNavigationSheet">
    <span className="sheetNavigationSheet__sheetName">{sheetName}</span>
    <SheetOptionButton
      isActive={isActiveSheet}
      isSheetNavigationOpen={isSheetNavigationOpen}
    />
  </div>
)

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
    dispatch(ExcelActions.REMOVE_SHEET())
    handleClose()
  }, [dispatch, handleClose])

  return (
    <Popper
      open={isSheetNavigationOpen}
      anchorEl={anchorRef.current}
      role={undefined}
    >
      <Paper>
        <ClickAwayListener onClickAway={handleClickAway}>
          <MenuList autoFocusItem={isSheetNavigationOpen} id="menu-list-grow">
            <MenuItem
              onClick={handleDeleteSheet}
              disabled={sheetNames.length === 1}
            >
              Delete
            </MenuItem>
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
  <Fragment>
    <SheetItemContent
      isSheetNavigationOpen={isSheetNavigationOpen}
      sheetName={sheetName}
      isActiveSheet={isActiveSheet}
    />
    {isActiveSheet && (
      <SheetOption
        anchorRef={anchorRef}
        isSheetNavigationOpen={isSheetNavigationOpen}
      />
    )}
  </Fragment>
)

const SortableItem = SortableElement(
  ({
    sheetName,
    isSheetNavigationOpen,
    handleSheetPress,
  }: {
    sheetName: ISheetName
    isSheetNavigationOpen: IIsSheetNavigationOpen
    handleSheetPress: IHandleSheetPress
  }) => {
    const activeSheetName = useTypedSelector(
      (state) => selectActiveSheetName(state),
      shallowEqual
    )

    const isActiveSheet = sheetName === activeSheetName

    const anchorRef = useRef<HTMLLIElement>(null)

    const handleMouseDown = useCallback(() => {
      if (!isActiveSheet) {
        handleSheetPress(sheetName)
      }
    }, [isActiveSheet, isSheetNavigationOpen, handleSheetPress])

    return (
      <li
        ref={anchorRef}
        className={`sheetNavigationSheetContainer ${
          isActiveSheet
            ? 'sheetNavigationSheetContainer--active'
            : 'sheetNavigationSheetContainer--inactive'
        }`}
        onMouseDown={handleMouseDown}
      >
        <NormalSheetItem
          anchorRef={anchorRef}
          handleSheetPress={handleSheetPress}
          isActiveSheet={isActiveSheet}
          isSheetNavigationOpen={isSheetNavigationOpen}
          sheetName={sheetName}
        />
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
  }) => (
    <ul className="sheetNavigation__sheets">
      {sheetNames.map((sheetName, index) => (
        <SortableItem
          key={`item-${sheetName}`}
          index={index}
          sheetName={sheetName}
          isSheetNavigationOpen={isSheetNavigationOpen}
          handleSheetPress={handleSheetPress}
        />
      ))}
    </ul>
  )
)

const SheetAdder: FunctionComponent = () => {
  const dispatch = useDispatch()

  const handleAddSheet = useCallback(() => {
    dispatch(ExcelActions.ADD_SHEET())
  }, [dispatch])

  return (
    <Button
      className="sheetNavigationOptions__addSheet"
      onClick={handleAddSheet}
    >
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
  <div className=" sheetNavigationOptions">
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
  <div className="sheetNavigation">
    <SheetNavigationOptions handleSheetPress={handleSheetPress} />
    <HorizontalNavigation handleSheetPress={handleSheetPress} />
  </div>
)

const RoutedSheetNavigation = () => {
  const history = useHistory()
  const match = useRouteMatch<{ activeSheetName: ISheetName }>()

  const handleSheetPress = useCallback(
    (sheetName) => {
      const { activeSheetName } = match.params
      if (sheetName !== activeSheetName) {
        history.push(sheetName)
      }
    },
    [history, match]
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
