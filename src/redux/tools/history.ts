import {
  selectActiveCellPosition,
  selectInactiveSelectionAreas,
} from '../selectors/base'
import IRootStore from '../../@types/store'
import { IStyleActionPayload } from '../../@types/history'

export const getStyleActionPayload = (
  state: IRootStore
): IStyleActionPayload => ({
  activeCellPosition: selectActiveCellPosition(state),
  inactiveSelectionAreas: selectInactiveSelectionAreas(state),
})
