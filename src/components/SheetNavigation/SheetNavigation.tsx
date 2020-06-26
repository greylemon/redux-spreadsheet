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
import { useHistory, useRouteMatch } from 'react-router-dom'

const SortableItem = SortableElement(
  ({
    sheetName,
    activeSheetName,
  }: {
    sheetName: ISheetName
    activeSheetName: ISheetName
  }) => (
    <li
      className={`sheetNavigation__sheet ${
        sheetName === activeSheetName ? 'sheetNavigation__sheet--active' : ''
      }`}
    >
      {sheetName}
    </li>
  )
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
        />
      ))}
    </ul>
  )
)

const SheetNavigation: FunctionComponent<{
  handleSortStart: ({ index }: { index: number }) => void
}> = ({ handleSortStart }) => {
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
      <SortableList
        axis="x"
        lockAxis="x"
        sheetNames={sheetNames}
        activeSheetName={activeSheetName}
        onSortStart={handleSortStart}
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

  const handleSortStart = useCallback(
    ({ index }) => {
      if (index !== activeSheetNameIndex) {
        const sheetName = sheetNames[index]
        history.push(sheetName)
      }
    },
    [activeSheetNameIndex, sheetNames, history]
  )

  return <SheetNavigation handleSortStart={handleSortStart} />
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

  const handleSortStart = useCallback(
    ({ index }) => {
      if (index !== activeSheetNameIndex) {
        const sheetName = sheetNames[index]
        dispatch(ExcelActions.CHANGE_SHEET(sheetName))
      }
    },
    [dispatch, activeSheetNameIndex, sheetNames, history]
  )

  return <SheetNavigation handleSortStart={handleSortStart} />
}

const SheetNavigationContainer: FunctionComponent<{ isRouted?: boolean }> = ({
  isRouted,
}) => (isRouted ? <RoutedSheetNavigation /> : <NonRoutedSheetNavigation />)

export default SheetNavigationContainer
