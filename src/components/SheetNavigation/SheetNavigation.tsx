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

const SheetNavigation: FunctionComponent<{ isRouted?: boolean }> = ({ isRouted }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const match = useRouteMatch()
  const {
    sheetNames,
    activeSheetNameIndex,
    activeSheetName,
  } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      activeSheetName: selectActiveSheetName(state),
      activeSheetNameIndex: selectActiveSheetNameIndex(state),
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

  const handleSortStart = useCallback(
    ({ index }) => {
      if (index !== activeSheetNameIndex) {
        const sheetName = sheetNames[index]

        if (isRouted) {
          history.push(sheetName)
        } else {
          dispatch(ExcelActions.CHANGE_SHEET(sheetName))
        }
      }
    },
    [dispatch, activeSheetNameIndex, sheetNames, history, match, isRouted]
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

export default SheetNavigation
