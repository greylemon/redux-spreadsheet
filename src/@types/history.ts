import { IPosition, IArea } from './state'

export type IStyleActionPayload = {
  activeCellPosition: IPosition
  inactiveSelectionAreas: IArea[]
}
