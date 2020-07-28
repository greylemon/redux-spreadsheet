import { IArea, IRows, IMerged } from '../../@types/state'

export const getMergeArea = (data: IRows, cellMergeArea: IMerged): IArea => {
  let mergedArea: IArea

  if (cellMergeArea.area) {
    mergedArea = cellMergeArea.area
  } else {
    const { parent } = cellMergeArea
    mergedArea = data[parent.y][parent.x].merged.area
  }

  return mergedArea
}
