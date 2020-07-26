import { IPosition, IArea } from './state'

export type IGeneralActionPayload = {
  activeCellPosition: IPosition
  inactiveSelectionAreas: IArea[]
}
