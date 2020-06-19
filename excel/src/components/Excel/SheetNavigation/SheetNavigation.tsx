import React, { useCallback } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { ISheetName } from '../../../@types/excel/state'
import { useTypedSelector } from '../../../redux/store'
import {
  selectSheetNames,
  selectActiveSheetName,
  selectActiveSheetNameIndex,
} from '../../../redux/ExcelStore/selectors'
import { shallowEqual, useDispatch } from 'react-redux'
import { ExcelActions } from '../../../redux/ExcelStore/store'

const SortableItem = SortableElement(
  ({ sheetName }: { sheetName: ISheetName }) => (
    <li className="sheetNavigation__sheet">{sheetName}</li>
  )
)

const SortableList = SortableContainer(
  ({ sheetNames }: { sheetNames: string[] }) => (
    <ul className="sheetNavigation__sheets">
      {sheetNames.map((sheetName, index) => (
        <SortableItem
          key={`item-${sheetName}`}
          index={index}
          sheetName={sheetName}
        />
      ))}
    </ul>
  )
)

const SheetNavigation = () => {
  const dispatch = useDispatch()
  const { sheetNames, activeSheetNameIndex } = useTypedSelector(
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
        dispatch(ExcelActions.CHANGE_SHEET(sheetNames[index]))
      }
    },
    [dispatch, activeSheetNameIndex, sheetNames]
  )

  return (
    <div className="sheetNavigation">
      <SortableList
        axis="x"
        lockAxis="x"
        sheetNames={sheetNames}
        onSortStart={handleSortStart}
        onSortEnd={handleSortEnd}
      />
    </div>
  )
}

export default SheetNavigation
