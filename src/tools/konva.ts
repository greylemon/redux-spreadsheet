import { IPosition } from '../@types/state'
import { ICellTypes } from '../@types/general'

export const getPositionFromCellId = (
  currentTarget: any
): { type: ICellTypes; position: IPosition } => {
  const [type, address] = currentTarget.attrs.id.split('=')

  return { type, position: JSON.parse(address) }
}
