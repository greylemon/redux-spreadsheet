import React, { useCallback, FunctionComponent } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { ISheetName } from '../../@types/state'
import { useTypedSelector } from '../../redux/redux'
import {
  selectSheetNames,
  selectActiveSheetName,
  selectActiveSheetNameIndex,
} from '../../redux/selectors'
import { shallowEqual, useDispatch } from 'react-redux'
import { ExcelActions } from '../../redux/store'
import { useHistory } from 'react-router-dom'
import { IHandleSheetPress } from '../../@types/functions'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
import { ArrowDropDown } from '@material-ui/icons'

const SheetOptionButton: FunctionComponent<{ isActive: boolean }> = ({
  isActive,
}) => (
  <Button
    className="sheetNavigationSheet__option"
    size="small"
    disabled={!isActive}
  >
    <ArrowDropDown style={{ color: isActive ? 'green' : 'gray' }} />
  </Button>
)

const SortableItem = SortableElement(
  ({
    sheetName,
    activeSheetName,
  }: {
    sheetName: ISheetName
    activeSheetName: ISheetName
  }) => {
    const isActiveSheet = sheetName === activeSheetName

    return (
      <li
        className={`sheetNavigationSheetContainer ${
          isActiveSheet
            ? 'sheetNavigationSheetContainer--active'
            : 'sheetNavigationSheetContainer--inactive'
        }`}
      >
        <div className="sheetNavigationSheet">
          <span className="sheetNavigationSheet__sheetName">{sheetName}</span>
          <SheetOptionButton isActive={isActiveSheet} />
        </div>
      </li>
    )
  }
)

const SortableList = SortableContainer(
  ({
    sheetNames,
    activeSheetName,
  }: {
    sheetNames: string[]
    activeSheetName: ISheetName
  }) => (
    <ul className="sheetNavigation__sheets">
      {sheetNames.map((sheetName, index) => (
        <SortableItem
          key={`item-${sheetName}`}
          index={index}
          sheetName={sheetName}
          activeSheetName={activeSheetName}
          // disabled={true}
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
}> = ({ handleSheetPress }) => {
  return (
    <div className=" sheetNavigationOptions">
      <SheetSelector handleSheetPress={handleSheetPress} />
      <SheetAdder />
    </div>
  )
}

const SheetNavigation: FunctionComponent<{
  handleSheetPress: IHandleSheetPress
}> = ({ handleSheetPress }) => {
  const dispatch = useDispatch()
  const { sheetNames, activeSheetName } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      activeSheetName: selectActiveSheetName(state),
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

  return (
    <div className="sheetNavigation">
      <SheetNavigationOptions handleSheetPress={handleSheetPress} />
      <SortableList
        axis="x"
        lockAxis="x"
        sheetNames={sheetNames}
        activeSheetName={activeSheetName}
        updateBeforeSortStart={handleSheetPress}
        onSortEnd={handleSortEnd}
      />
    </div>
  )
}

const RoutedSheetNavigation = () => {
  const history = useHistory()
  const { sheetNames, activeSheetNameIndex } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      activeSheetNameIndex: selectActiveSheetNameIndex(state),
    }),
    shallowEqual
  )

  const handleSheetPress = useCallback(
    ({ index }) => {
      if (index !== activeSheetNameIndex) {
        const sheetName = sheetNames[index]
        history.push(sheetName)
      }
    },
    [activeSheetNameIndex, sheetNames, history]
  )

  return <SheetNavigation handleSheetPress={handleSheetPress} />
}

const NonRoutedSheetNavigation = () => {
  const dispatch = useDispatch()
  const { sheetNames, activeSheetNameIndex } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      activeSheetNameIndex: selectActiveSheetNameIndex(state),
    }),
    shallowEqual
  )

  const handleSheetPress = useCallback(
    ({ index }) => {
      if (index !== activeSheetNameIndex) {
        const sheetName = sheetNames[index]
        dispatch(ExcelActions.CHANGE_SHEET(sheetName))
      }
    },
    [dispatch, activeSheetNameIndex, sheetNames, history]
  )

  return <SheetNavigation handleSheetPress={handleSheetPress} />
}

const SheetNavigationContainer: FunctionComponent<{ isRouted?: boolean }> = ({
  isRouted,
}) => (isRouted ? <RoutedSheetNavigation /> : <NonRoutedSheetNavigation />)

export default SheetNavigationContainer
