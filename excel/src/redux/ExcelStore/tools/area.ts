import {
  IPosition,
  ISelectionArea,
  IRange,
  IArea,
  IAreaRange,
} from '../../../@types/excel/state'

export const getOrderedAreaFromPositions = (
  position: IPosition,
  position2: IPosition
): IArea => ({
  start: {
    y: Math.min(position.y, position2.y),
    x: Math.min(position.x, position2.x),
  },
  end: {
    y: Math.max(position.y, position2.y),
    x: Math.max(position.x, position2.x),
  },
})

export const getAreaRanges = (area: IArea) => {
  const orderedArea = getOrderedAreaFromPositions(area.start, area.end)

  return {
    yRange: { start: orderedArea.start.y, end: orderedArea.end.y } as IRange,
    xRange: { start: orderedArea.start.x, end: orderedArea.end.x } as IRange,
  }
}

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

export const getAndAddArea = (area: IArea, areas: Array<IArea>) => {
  let newAreas: Array<IArea>

  const superAreaIndex = getFirstSuperAreaIndex(area, areas)

  if (superAreaIndex > -1) {
    newAreas = [
      ...areas.slice(0, superAreaIndex),
      ...getAreaDifference(area, areas[superAreaIndex]),
      ...areas.slice(superAreaIndex + 1),
    ]
  } else {
    newAreas = [...areas, area]
  }

  return newAreas
}

/**
 * Finds the index of the first superset of area
 */
export const getFirstSuperAreaIndex = (area: IArea, areas: Array<IArea>) => {
  const orderedArea = getOrderedAreaFromPositions(area.start, area.end)

  const areaRanges = getAreaRanges(orderedArea)

  // console.log('--', areaRanges, areas)

  return areas.findIndex(({ start, end }) => {
    const potentialSuperArea = getOrderedAreaFromPositions(start, end)
    const potentialSuperAreaRanges = getAreaRanges(potentialSuperArea)

    // console.log(potentialSuperAreaRanges)

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
