import { IRange } from '../../../@types/excel/state'
// https://stackoverflow.com/questions/55480499/split-set-of-intervals-into-minimal-set-of-disjoint-intervals
export const getElementaryRanges = (ranges: IRange[], length: number) => {
  const points: IRange[] = []
  if (ranges.length) {
    const first = ranges[0]
    if (first.start) {
      ranges.push({ start: 0, end: first.end - 1 })
    }
  }

  for (const range of ranges) {
    points.push({ start: range.start, end: 1 })
    points.push({ start: range.end + 1, end: -1 })
  }

  let count = 0
  let prev: null | number = null

  const result = points
    .sort((a, b) => a.start - b.start) // sort boundary points
    .map((x) => {
      // make an interval for every section that is inside any input interval
      const ret =
        x.start > prev! && count !== 0
          ? { start: prev!, end: x.start - 1 }
          : null
      prev = x.start
      count += x.end
      return ret
    })
    .filter((x) => !!x) as Array<IRange>

  if (result.length) {
    const last = result[result.length - 1]
    if (last.end !== length - 1) {
      result.push({ start: last.end + 1, end: length - 1 })
    }
  }

  const searchCap = result.length
  let previousEnd = -1

  for (let i = 0; i < searchCap; i++) {
    const range = result[i]
    if (range.start !== previousEnd + 1) {
      result.push({ start: previousEnd + 1, end: range.start - 1 })
    }
    previousEnd = range.end
  }

  if (!result.length) result.push({ start: 0, end: length - 1 })

  return result.sort((a, b) => a.start - b.start)
}

// https://leetcode.com/problems/merge-intervals/solution/
export const mergeRanges = (ranges: IRange[]) => {
  const mergedRanges: IRange[] = []

  for (const range of ranges) {
    // if the list of merged intervals is empty or if the current
    // interval does not overlap with the previous, simply append it.
    if (
      !mergedRanges.length ||
      mergedRanges[mergedRanges.length - 1].end < range.start
    ) {
      mergedRanges.push({ ...range })
      // otherwise, there is overlap, so we merge the current and previous
      // intervals.
    } else {
      mergedRanges[mergedRanges.length - 1].end = Math.max(
        mergedRanges[mergedRanges.length - 1].end,
        range.end
      )
    }
  }

  return mergedRanges
}
