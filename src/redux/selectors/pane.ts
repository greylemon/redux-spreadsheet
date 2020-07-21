import { createSelector } from '@reduxjs/toolkit'
import {
  checkIsAreaInBottomLeftPane,
  computeSelectionAreaBottomLeftStyle,
  computeActiveCellBottomLeftStyle,
  checkIsActiveCellInBottomLeftPane,
  checkIsDragRowOffsetInBottomLeftPane,
} from '../../tools/styles/bottom_left_pane'
import {
  computeSelectionAreaBottomRightStyle,
  checkIsAreaInBottomRightPane,
  checkIsActiveCellInBottomRightPane,
} from '../../tools/styles/bottom_right_pane'
import {
  checkIsAreaInTopLeftPane,
  computeSelectionAreaTopLeftStyle,
  checkIsActiveCellInTopLeftPane,
  checkIsDragColumnOffsetInTopLeftPane,
  checkIsDragRowOffsetInTopLeftPane,
} from '../../tools/styles/top_left_pane'
import {
  computeSelectionAreaTopRightStyle,
  checkIsAreaInTopRightPane,
  checkIsActiveCellInTopRightPane,
  checkIsDragColumnOffsetInTopRightPane,
} from '../../tools/styles/top_right_pane'
import {
  selectFactoryIsAreaInRelevantPane,
  selectFactoryActiveCellStyle,
  selectFactorySelectionAreaStyle,
  selectFactoryInactiveSelectionAreasStyle,
  selectFactoryIsActiveCellInRelevantPane,
  selectFactoryIsDragColumnOffsetInCorrectPane,
  selectFactoryIsDragRowOffsetInCorrectPane,
} from './factory'
import {
  selectRowDraggerStyle,
  selectGetRowHeight,
  selectRowOffsets,
} from './custom'
import { selectFreezeRowCount } from './activeSheet'

export const selectIsAreaInBottomLeftPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInBottomLeftPane
)
export const selectIsAreaInBottomRightPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInBottomRightPane
)
export const selectIsAreaInTopLeftPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInTopLeftPane
)
export const selectIsAreaInTopRightPane = selectFactoryIsAreaInRelevantPane(
  checkIsAreaInTopRightPane
)

export const selectActiveCellAreaBottomLeftStyle = selectFactoryActiveCellStyle(
  computeActiveCellBottomLeftStyle
)
export const selectActiveCellAreaBottomRightStyle = selectFactoryActiveCellStyle()
export const selectActiveCellAreaTopLeftStyle = selectFactoryActiveCellStyle()
export const selectActiveCellAreaTopRightStyle = selectFactoryActiveCellStyle()

export const selectSelectionAreaBottomLeftStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaBottomLeftStyle
)
export const selectSelectionAreaBottomRightStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaBottomRightStyle
)
export const selectSelectionAreaTopLeftStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaTopLeftStyle
)
export const selectSelectionAreaTopRightStyle = selectFactorySelectionAreaStyle(
  computeSelectionAreaTopRightStyle
)

export const selectInactiveSelectionAreasBottomLeftStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaBottomLeftStyle,
  checkIsAreaInBottomLeftPane
)

export const selectInactiveSelectionAreasBottomRightStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaBottomRightStyle,
  checkIsAreaInBottomRightPane
)

export const selectInactiveSelectionAreasTopLeftStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaTopLeftStyle,
  checkIsAreaInTopLeftPane
)

export const selectInactiveSelectionAreasTopRightStyle = selectFactoryInactiveSelectionAreasStyle(
  computeSelectionAreaTopRightStyle,
  checkIsAreaInTopRightPane
)

export const selectIsActiveCellInBottomLeftPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInBottomLeftPane
)
export const selectIsActiveCellInBottomRightPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInBottomRightPane
)
export const selectIsActiveCellInTopLeftPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInTopLeftPane
)
export const selectIsActiveCellInTopRightPane = selectFactoryIsActiveCellInRelevantPane(
  checkIsActiveCellInTopRightPane
)

export const selectIsDragColumnOffsetInTopLeftPane = selectFactoryIsDragColumnOffsetInCorrectPane(
  checkIsDragColumnOffsetInTopLeftPane
)
export const selectIsDragColumnOffsetInInTopRightPane = selectFactoryIsDragColumnOffsetInCorrectPane(
  checkIsDragColumnOffsetInTopRightPane
)
export const selectIsDragRowOffsetInTopLeftPane = selectFactoryIsDragRowOffsetInCorrectPane(
  checkIsDragRowOffsetInTopLeftPane
)
export const selectIsDragRowOffsetInInBottomLeftPane = selectFactoryIsDragRowOffsetInCorrectPane(
  checkIsDragRowOffsetInBottomLeftPane
)

export const selectRowDraggerBottomLeftStyle = createSelector(
  [
    selectRowDraggerStyle,
    selectFreezeRowCount,
    selectRowOffsets,
    selectGetRowHeight,
  ],
  (rowDraggerStyle, freezeRowCount, rowOffsets, getRowHeight) => ({
    ...rowDraggerStyle,
    top:
      +rowDraggerStyle.top -
      rowOffsets[freezeRowCount] -
      getRowHeight(freezeRowCount),
  })
)
