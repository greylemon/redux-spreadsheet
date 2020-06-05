import { ISelectionArea } from '../../../@types/excel/state'

export const isSelectionAreaEqualPosition = ({ start, end }: ISelectionArea) =>
  start.x === end.x && start.y === end.y
