import {
  IPosition,
  ISelectionArea,
  IRange,
  IArea,
  IAreaRange,
} from '../../@types/state'

export const getMinPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
})

export const getMaxPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.max(start.x, end.x),
  y: Math.max(start.y, end.y),
})

export const getOrderedAreaFromPositions = (
  position: IPosition,
  position2: IPosition
): IArea => ({
  start: {
    x: Math.min(position.x, position2.x),
    y: Math.min(position.y, position2.y),
  },
  end: {
    x: Math.max(position.x, position2.x),
    y: Math.max(position.y, position2.y),
  },
})

export const getOrderedAreaFromArea = (area: IArea) => ({
  start: getMinPositionFromArea(area),
  end: getMaxPositionFromArea(area),
})

export const getAreaRanges = (area: IArea) => {
  const orderedArea = getOrderedAreaFromArea(area)

  return getAreaRangesFromOrderedArea(orderedArea)
}

export const getAreaRangesFromOrderedArea = (orderedArea: IArea) => ({
  xRange: { start: orderedArea.start.x, end: orderedArea.end.x } as IRange,
  yRange: { start: orderedArea.start.y, end: orderedArea.end.y } as IRange,
})

export const checkIsPositionEqualOtherPosition = (
  position: IPosition,
  otherPosition: IPosition
) => position.x === otherPosition.x && position.y === otherPosition.y

export const getAreaFromPosition = (position: IPosition) => ({
  start: { ...position },
  end: { ...position },
})

export const getAreaDifference = (areaToSubtract: IArea, area: IArea) => {
  const areaDifference: Array<IArea> = []

  const areaRange = getAreaRanges(area)
  const areaToSubtractRange = getAreaRanges(areaToSubtract)

  const minSX = areaRange.xRange.start
  const midLeftSX = areaToSubtractRange.xRange.start
  const midRightSX = areaToSubtractRange.xRange.end
  const maxSX = areaRange.xRange.end

  const minSY = areaRange.yRange.start
  const midTopSY = areaToSubtractRange.yRange.start
  const midBottomSY = areaToSubtractRange.yRange.end
  const maxSY = areaRange.yRange.end

  if (minSY !== midTopSY)
    areaDifference.push({
      start: {
        x: minSX,
        y: minSY,
      },
      end: {
        x: maxSX,
        y: midTopSY - 1,
      },
    })
  if (minSX !== midLeftSX)
    areaDifference.push({
      start: {
        x: minSX,
        y: midTopSY,
      },
      end: {
        x: midLeftSX - 1,
        y: midBottomSY,
      },
    })
  if (maxSX !== midRightSX)
    areaDifference.push({
      start: {
        x: midRightSX + 1,
        y: midTopSY,
      },
      end: {
        x: maxSX,
        y: midBottomSY,
      },
    })
  if (maxSY !== midBottomSY)
    areaDifference.push({
      start: {
        x: minSX,
        y: midBottomSY + 1,
      },
      end: {
        x: maxSX,
        y: maxSY,
      },
    })

  return areaDifference
}

export const getAndAddAreaFromSuperAreaIndex = (
  superAreaIndex: number,
  area: IArea,
  areas: Array<IArea>
) => [
  ...areas.slice(0, superAreaIndex),
  ...getAreaDifference(area, areas[superAreaIndex]),
  ...areas.slice(superAreaIndex + 1),
]

export const getAndAddArea = (area: IArea, areas: Array<IArea>) => {
  let newAreas: Array<IArea>

  const superAreaIndex = getFirstSuperAreaIndex(area, areas)

  if (superAreaIndex > -1) {
    newAreas = getAndAddAreaFromSuperAreaIndex(superAreaIndex, area, areas)
  } else {
    newAreas = [...areas, area]
  }

  return { superAreaIndex, newAreas }
}

/**
 * Finds the index of the first superset of area
 */
export const getFirstSuperAreaIndex = (area: IArea, areas: Array<IArea>) => {
  const orderedArea = getOrderedAreaFromArea(area)

  const areaRanges = getAreaRangesFromOrderedArea(orderedArea)

  return areas.findIndex((elementArea) => {
    const potentialSuperArea = getOrderedAreaFromArea(elementArea)
    const potentialSuperAreaRanges = getAreaRangesFromOrderedArea(
      potentialSuperArea
    )

    return checkIsAreaRangeContainedInOtherAreaRange(
      areaRanges,
      potentialSuperAreaRanges
    )
  })
}

export const checkIsAreaRangeContainedInOtherAreaRange = (
  areaRange: IAreaRange,
  otherAreaRange: IAreaRange
) =>
  checkIsRangeContainedInOtherRange(areaRange.xRange, otherAreaRange.xRange) &&
  checkIsRangeContainedInOtherRange(areaRange.yRange, otherAreaRange.yRange)

export const checkIsSelectionAreaEqualPosition = ({
  start,
  end,
}: ISelectionArea) => start.x === end.x && start.y === end.y

export const checkIsRangeContainedInOtherRange = (
  range: IRange,
  otherRange: IRange
) => otherRange.start <= range.start && range.end <= otherRange.end
