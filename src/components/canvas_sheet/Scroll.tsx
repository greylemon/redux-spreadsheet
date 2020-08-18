import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  CSSProperties,
} from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { Slider, withStyles } from '@material-ui/core'
import { useTypedSelector } from '../../redux/redux'
import {
  selectScrollHorizontalWidth,
  selectScrollVerticalHeight,
  selectScrollHorizontalBlock,
  selectScrollVerticalBlock,
} from '../../redux/selectors/custom'
import { getScrollbarSize } from '../../tools/misc'
import {
  selectTopLeftPositionY,
  selectTopLeftPositionX,
} from '../../redux/selectors/base'
import {
  selectFreezeColumnCount,
  selectFreezeRowCount,
} from '../../redux/selectors/activeSheet'
import { ExcelActions } from '../../redux/store'

const CustomSlider = (type: 'horizontal' | 'vertical') => {
  const styles = {
    root: {
      color: 'darkgreen',
      padding: type === 'horizontal' ? '10px 0' : 0,
    },
    active: {},
    thumb: {
      height: type === 'vertical' ? 21 : 12,
      width: type === 'horizontal' ? 21 : 12,
      backgroundColor: '#fff',
      marginTop: type === 'vertical' ? -10 : -6,
      marginLeft: type === 'horizontal' ? -10 : -6,
      borderRadius: 3,
      border: '1px solid gray',
      boxShadow: '#cca 0 2px 2px',
      '&:focus, &:hover, &$active': {
        boxShadow: '#ccc 0 2px 3px 1px',
      },
    },
    vertical: {
      marginLeft: type === 'vertical' ? -2 : 0,
    },
  }

  return (() => withStyles(styles)(Slider))()
}

const HorizontalConfiguredSlider = CustomSlider('horizontal')
const VerticalConfiguredSlider = CustomSlider('vertical')

export const CanvasHorizontalScroll: FunctionComponent = () => {
  const dispatch = useDispatch()
  const {
    scrollLength,
    scrollOffsetDimension,
    blockLength,
    freezeColumnCount,
  } = useTypedSelector(
    (state) => ({
      scrollLength: selectScrollHorizontalWidth(state),
      scrollOffsetDimension: selectTopLeftPositionX(state),
      blockLength: selectScrollHorizontalBlock(state),
      freezeColumnCount: selectFreezeColumnCount(state),
    }),
    shallowEqual
  )

  const handleScroll = useCallback(
    (event, value) => {
      if (event.type !== 'keydown' && value !== scrollOffsetDimension)
        dispatch(ExcelActions.SCROLL_HORIZONTAL(value))
    },
    [dispatch, scrollLength, scrollOffsetDimension]
  )

  const scrollStyle = useMemo(
    (): CSSProperties => ({
      width: '100%',
      height: '100%',
    }),
    []
  )

  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid #DCDCDC',
      }}
    >
      <span
        style={{ minWidth: blockLength - 1, borderRight: '1px solid #DCDCDC' }}
      />
      <HorizontalConfiguredSlider
        orientation="horizontal"
        style={scrollStyle}
        value={scrollOffsetDimension}
        min={freezeColumnCount + 1}
        max={scrollLength + freezeColumnCount}
        onChange={handleScroll}
        track={false}
      />
    </div>
  )
}

export const CanvasVerticalScroll: FunctionComponent = () => {
  const dispatch = useDispatch()
  const {
    scrollLength,
    scrollOffsetDimension,
    blockLength,
    freezeRowCount,
  } = useTypedSelector(
    (state) => ({
      scrollLength: selectScrollVerticalHeight(state),
      scrollOffsetDimension: selectTopLeftPositionY(state),
      blockLength: selectScrollVerticalBlock(state),
      freezeRowCount: selectFreezeRowCount(state),
    }),
    shallowEqual
  )

  const handleScroll = useCallback(
    (event, value) => {
      const newOffset = scrollLength - value

      if (event.type !== 'keydown' && newOffset !== scrollOffsetDimension)
        dispatch(ExcelActions.SCROLL_VERTICAL(newOffset))
    },
    [dispatch, scrollLength, freezeRowCount, scrollOffsetDimension]
  )

  const scrollStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
    }),
    []
  )

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        border: '1px solid #DCDCDC',
        height: `calc(100% - ${getScrollbarSize()}px - 1px)`,
        width: getScrollbarSize(),
      }}
    >
      <span
        style={{
          minHeight: blockLength - 1,
          borderBottom: '1px solid #DCDCDC',
        }}
      />
      <VerticalConfiguredSlider
        orientation="vertical"
        style={scrollStyle}
        value={scrollLength - scrollOffsetDimension}
        min={-freezeRowCount}
        max={scrollLength - 1 - freezeRowCount}
        onChange={handleScroll}
        track={false}
      />
    </div>
  )
}
