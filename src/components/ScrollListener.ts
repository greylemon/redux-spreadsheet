import { FunctionComponent, useEffect, useRef } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { IGridRef } from '../@types/ref'
import { useTypedSelector } from '../redux/redux'
import {
  selectScrollOffset,
  selectScrollHorizontal,
  selectScrollVertical,
} from '../redux/selectors/base'
import { THUNK_UPDATE_SCROLL_EVENT } from '../redux/thunks/event'

const ScrollListener: FunctionComponent<{ gridRef: IGridRef }> = ({
  gridRef,
}) => {
  const dispatch = useDispatch()
  const intervalRef = useRef<ReturnType<typeof setTimeout>>()
  const { scrollHorizontal, scrollOffset, scrollVertical } = useTypedSelector(
    (state) => ({
      scrollOffset: selectScrollOffset(state),
      scrollHorizontal: selectScrollHorizontal(state),
      scrollVertical: selectScrollVertical(state),
    }),
    shallowEqual
  )

  useEffect(() => {
    if (scrollVertical !== 'neutral' || scrollHorizontal !== 'neutral') {
      intervalRef.current = setTimeout(
        () => dispatch(THUNK_UPDATE_SCROLL_EVENT(gridRef)),
        50
      )
    }

    return () => {
      if (scrollVertical === 'neutral' && scrollHorizontal === 'neutral')
        clearInterval(intervalRef.current)
    }
  }, [
    gridRef,
    dispatch,
    intervalRef,
    scrollHorizontal,
    scrollVertical,
    scrollOffset,
  ])

  return null
}

export default ScrollListener
