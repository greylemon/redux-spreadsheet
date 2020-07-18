import {
  checkIsAreaInBottomLeftPane,
  computeSelectionAreaBottomLeftStyle,
  computeActiveCellBottomLeftStyle,
  checkIsActiveCellInBottomLeftPane,
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
} from '../../tools/styles/top_left_pane'
import {
  computeSelectionAreaTopRightStyle,
  checkIsAreaInTopRightPane,
  checkIsActiveCellInTopRightPane,
} from '../../tools/styles/top_right_pane'
import {
  selectFactoryIsAreaInRelevantPane,
  selectFactoryActiveCellStyle,
  selectFactorySelectionAreaStyle,
  selectFactoryInactiveSelectionAreasStyle,
  selectFactoryIsActiveCellInRelevantPane,
} from './factory'

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
