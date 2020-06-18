import React, { useCallback } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { ISheetName } from '../../../@types/excel/state'
import { useTypedSelector } from '../../../redux/store'
import {
  selectSheetNames,
  selectActiveSheetName,
  selectActiveSheetNameIndex,
} from '../../../redux/ExcelStore/selectors'
import { shallowEqual } from 'react-redux'

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
  // const dispatch = useDispatch()
  const { sheetNames } = useTypedSelector(
    (state) => ({
      sheetNames: selectSheetNames(state),
      activeSheetName: selectActiveSheetName(state),
      activeSheetNameIndex: selectActiveSheetNameIndex(state),
    }),
    shallowEqual
  )

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        // dispatch(ExcelActions)
      }
    },
    [] // dispatch]
  )

  return (
    <div className="sheetNavigation">
      <SortableList
        axis="x"
        lockAxis="x"
        sheetNames={sheetNames}
        onSortEnd={handleSortEnd}
      />
    </div>
  )
}

export default SheetNavigation
