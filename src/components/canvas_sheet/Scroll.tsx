import React, { FunctionComponent, useCallback } from 'react'
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
import { ExcelActions } from '../../redux/store'
import {
  selectTopLeftPositionY,
  selectTopLeftPositionX,
} from '../../redux/selectors/base'
import {
  selectFreezeColumnCount,
  selectFreezeRowCount,
} from '../../redux/selectors/activeSheet'

const CustomSlider = (type: 'horizontal' | 'vertical') =>
  withStyles({
    root: {
      color: '#52af77',
    },
    active: {},
    thumb: {
      height: type === 'vertical' ? 20 : 12,
      width: type === 'horizontal' ? 20 : 12,
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
  })(Slider)
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
    (_, value) => {
      dispatch(ExcelActions.SCROLL_HORIZONTAL(value))
    },
    [dispatch, scrollLength]
  )

  return (
    <div style={{ display: 'flex' }}>
      <span style={{ width: blockLength, borderRadius: 1 }} />
      <HorizontalConfiguredSlider
        orientation="horizontal"
        style={{
          width: `calc(100% - ${blockLength}px)`,
          height: '100%',
        }}
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
    (_, value) => {
      dispatch(ExcelActions.SCROLL_VERTICAL(scrollLength - value))
    },
    [dispatch, scrollLength, freezeRowCount]
  )

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
      <span style={{ height: blockLength }} />
      <VerticalConfiguredSlider
        orientation="vertical"
        style={{
          width: 0,
          height: `calc(100% - ${getScrollbarSize() + blockLength}px)`,
        }}
        value={scrollLength - scrollOffsetDimension}
        min={-freezeRowCount}
        max={scrollLength - 1 - freezeRowCount}
        onChange={handleScroll}
        track={false}
      />
    </div>
  )
}
