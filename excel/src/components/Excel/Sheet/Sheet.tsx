import React from 'react'
import { VariableSizeGrid } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { useTypedSelector } from '../../../store'
import { shallowEqual } from 'react-redux'
import Cell from './Cell'
import {
  selectColumnCount,
  selectColumnWidths,
  selectRowCount,
  selectData,
  selectFreezeRowCount,
  selectFreezeColumnCount,
  selectGetRowHeight,
  selectGetColumnWidth,
} from '../../../store/ExcelStore/selectors'
import BottomRightPane from './BottomRightPane'

/**
 * React is a framework for building HTML. It operates on lifecycle stages which improves performance and predictability.
 *
 * There are 2 ways to declare React components:
 * 1) Class Components: https://reactjs.org/docs/react-component.html
 * 2) Functional Components (through hooks): https://reactjs.org/docs/hooks-overview.html#but-what-is-a-hook
 *
 * The recommended approach and the direction of React is through functional components as it has
 * less boilerplate code and is more straightforward to implement.
 * Class components have additional methods which can improve performance, but for
 * many cases, the performance gain is not worth the advantage of hooks as hooks are cleaner and easier to set up.
 * Check out the motivation for hooks: https://reactjs.org/docs/hooks-intro.html#motivation
 *
 * Hooks are functions that let you “hook into” React state and lifecycle features from function components.
 * Many hook functions can be used for performance improvements. There are memoize functions such as useMemo
 * and useCallback for memoizing the return value of data or functions. However, overusing these memoizing functions
 * can be more dangerous than helpful. Only use useMemo, useCallback, and other memoize functions for
 * heavy computations where you’re certain that it will improve performance.
 *
 * Some of the React hooks: useCallback, useMemo, useEffect, useRef
 *
 * Please check out the hooks documentation for more functions!
 * ==================================================================================
 *
 * useCallback: https://reactjs.org/docs/hooks-reference.html
 *
 * Memoize the function's return value based on the dependency array.
 *
 * The first parameter is the function to memoize.
 *
 * The second parameter is the recomputation dependencies
 *
 * If:
 * - you do not supply a dependency array, the function will always be recomputed
 * - you supply dependencies in the array, the function will only be recomputed when the dependencies change
 * - (related with second point) you supply an empty array, the value will never be recomputed
 * because there will never be a dependency change
 *
 * In this case, the sampleAction function is only recomputed when dispatch changes
 * because dispatch is in the dependency array
 * ==================================================================================
 *
 * useEffect: https://reactjs.org/docs/hooks-reference.html#useeffect
 *
 * useEffect is triggered on initial render and dependency change
 *
 * It is quite useful, the first parameter is the function that is called on trigger.
 * The return value of this function is the clean up function, usually used when components unmount:
 * https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect
 *
 * The second parameter is the dependency for recomputation, just like useCallback
 */
export const Sheet = ({ height, width }: Size) => {
  // const dispatch = useDispatch()

  const {
    columnCount,
    rowCount,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
  } = useTypedSelector(
    (state) => ({
      columnCount: selectColumnCount(state),
      columnWidths: selectColumnWidths(state),
      rowCount: selectRowCount(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectFreezeRowCount(state) + 1,
      tableFreezeColumnCount: selectFreezeColumnCount(state) + 1,
    }),
    shallowEqual
  )

  const itemData = { data }

  return (
    /**
     * A custom component can nest other components using the children prop.
     * This is extremely useful!
     */
    <VariableSizeGrid
      columnCount={columnCount}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={rowCount}
      rowHeight={getRowHeight}
      width={width}
      itemData={itemData}
      freezeColumnCount={tableFreezeColumnCount}
      freezeRowCount={tableFreezeRowCount}
      extraBottomRightElement={
        <BottomRightPane key="bottom-right-activity-pane" />
      }
    >
      {Cell}
    </VariableSizeGrid>
  )
}

const SheetSizer = ({ height, width }: Size) => (
  <Sheet height={height} width={width} />
)

const SheetContainer = () => <AutoSizer children={SheetSizer} />

export default SheetContainer
