import {
  IPosition,
  ISelectionArea,
  IRange,
  IArea,
  IAreaRange,
} from '../@types/state'
import { getScrollbarSize } from './misc'
import {
  SHEET_COLUMN_WIDTH_HEADER,
  SHEET_ROW_HEIGHT_HEADER,
} from '../constants/defaults'
import { ICellMapSet } from '../@types/objects'
import { IHorizontalOffsetType, IVerticalOffsetType } from '../@types/general'

export const getMinPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
})

export const getMaxPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.max(start.x, end.x),
  y: Math.max(start.y, end.y),
})

export const getAreaRangesFromOrderedArea = (
  orderedArea: IArea
): IAreaRange => ({
  xRange: { start: orderedArea.start.x, end: orderedArea.end.x } as IRange,
  yRange: { start: orderedArea.start.y, end: orderedArea.end.y } as IRange,
})

export const checkIsPositionEqualOtherPosition = (
  position: IPosition,
  otherPosition: IPosition
): boolean => position.x === otherPosition.x && position.y === otherPosition.y

export const getAreaFromPosition = (position: IPosition): IArea => ({
  start: { ...position },
  end: { ...position },
})

export const checkIsPositionContainedInArea = (
  position: IPosition,
  area: IArea
): boolean =>
  area.start.x <= position.x &&
  position.x <= area.end.x &&
  area.start.y <= position.y &&
  position.y <= area.end.y

export const checkIsAreaEqualPosition = ({
  start,
  end,
}: ISelectionArea): boolean => start.x === end.x && start.y === end.y

export const checkIsRangeContainedInOtherRange = (
  range: IRange,
  otherRange: IRange
): boolean => otherRange.start <= range.start && range.end <= otherRange.end

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

export const getEditableCellPositionFromBoundedPosition = (
  position: IPosition,
  orderedSheetArea: IArea
): IPosition => {
  const editableCellPosition: IPosition = { ...position }

  editableCellPosition.x = Math.max(
    position.x,
    orderedSheetArea.start.x + SHEET_COLUMN_WIDTH_HEADER + 1
  )
  editableCellPosition.y = Math.max(
    position.y,
    orderedSheetArea.start.y + SHEET_ROW_HEIGHT_HEADER + 1
  )

  return editableCellPosition
}

export const getOrderedAreaFromArea = (area: IArea): IArea => ({
  start: getMinPositionFromArea(area),
  end: getMaxPositionFromArea(area),
})

export const checkIsAreaEqualOtherArea = (
  area: IArea,
  otherArea: IArea
): boolean => {
  const orderedArea = getOrderedAreaFromArea(area)
  const otherOrderedArea = getOrderedAreaFromArea(otherArea)

  return (
    checkIsPositionEqualOtherPosition(
      orderedArea.start,
      otherOrderedArea.start
    ) &&
    checkIsPositionEqualOtherPosition(orderedArea.end, otherOrderedArea.end)
  )
}

export const checkIsAreaRangeContainedInOtherAreaRange = (
  areaRange: IAreaRange,
  otherAreaRange: IAreaRange
): boolean =>
  checkIsRangeContainedInOtherRange(areaRange.xRange, otherAreaRange.xRange) &&
  checkIsRangeContainedInOtherRange(areaRange.yRange, otherAreaRange.yRange)

export const getAreaRanges = (area: IArea): IAreaRange => {
  const orderedArea = getOrderedAreaFromArea(area)

  return getAreaRangesFromOrderedArea(orderedArea)
}

export const getAreaDifference = (
  areaToSubtract: IArea,
  area: IArea
): IArea[] => {
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
): IArea[] => [
  ...areas.slice(0, superAreaIndex),
  ...getAreaDifference(area, areas[superAreaIndex]),
  ...areas.slice(superAreaIndex + 1),
]

/**
 * Finds the index of the first superset of area
 */
export const getFirstSuperAreaIndex = (
  area: IArea,
  areas: Array<IArea>
): number => {
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

export const getAndAddArea = (
  area: IArea,
  areas: Array<IArea>
): {
  superAreaIndex: number
  newAreas: IArea[]
} => {
  let newAreas: Array<IArea>

  const superAreaIndex = getFirstSuperAreaIndex(area, areas)

  if (superAreaIndex > -1) {
    newAreas = getAndAddAreaFromSuperAreaIndex(superAreaIndex, area, areas)
  } else {
    newAreas = [...areas, area]
  }

  return { superAreaIndex, newAreas }
}

export const getCellMapSetFromAreas = (areas: IArea[]): ICellMapSet => {
  const cellMapSet: { [key: number]: Set<number> } = {}

  areas.forEach((area) => {
    const { xRange, yRange } = getAreaRanges(area)

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex += 1) {
      if (!cellMapSet[rowIndex]) cellMapSet[rowIndex] = new Set()

      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex += 1
      )
        cellMapSet[rowIndex].add(columnIndex)
    }
  })

  return cellMapSet
}

// ? If there's no scrollbar, this may fail?
export const boundPositionInOrderedArea = (
  position: IPosition,
  orderedSheetArea: IArea,
  rowAdjustment = -2,
  columnAdjustment = -2
): {
  boundedPosition: IPosition
  scrollHorizontal: IHorizontalOffsetType
  scrollVertical: IVerticalOffsetType
} => {
  const boundedPosition: IPosition = { ...position }
  const scrollBarSize = getScrollbarSize()

  let scrollHorizontal: IHorizontalOffsetType = 'neutral'
  let scrollVertical: IVerticalOffsetType = 'neutral'

  if (position.x < orderedSheetArea.start.x + 2) {
    boundedPosition.x = orderedSheetArea.start.x + 2
    scrollHorizontal = 'left'
  } else if (
    position.x >=
    orderedSheetArea.end.x - scrollBarSize + columnAdjustment
  ) {
    boundedPosition.x =
      orderedSheetArea.end.x - scrollBarSize + columnAdjustment
    scrollHorizontal = 'right'
  }

  if (position.y < orderedSheetArea.start.y + 2) {
    boundedPosition.y = orderedSheetArea.start.y + 2
    scrollVertical = 'top'
  } else if (
    position.y >=
    orderedSheetArea.end.y - scrollBarSize + rowAdjustment
  ) {
    boundedPosition.y = orderedSheetArea.end.y - scrollBarSize + rowAdjustment
    scrollVertical = 'bottom'
  }

  return { boundedPosition, scrollHorizontal, scrollVertical }
}

export const getlDimensionOffset = (
  offsets: number[],
  index: number,
  startIndex: number,
  freezeCount: number
) => offsets[index] + offsets[startIndex] - offsets[freezeCount]

export const getActualDimensionOffset = (
  offsets: number[],
  index: number,
  startIndex: number,
  freezeCount: number
) =>
  startIndex
    ? getlDimensionOffset(offsets, index, startIndex, freezeCount)
    : offsets[index]
