import { getElementaryRanges, mergeRanges } from '../../../src/tools/range'
import { IRange } from '../../../src/@types/state'

describe('Tool methods', () => {
  describe('Elementary Ranges', () => {
    it('Overlapping ranges', () => {
      const ranges: IRange[] = [
        {
          start: 0,
          end: 1,
        },
        {
          start: 1,
          end: 2,
        },
        {
          start: 2,
          end: 3,
        },
      ]

      expect(getElementaryRanges(ranges, 4)).toEqual([
        { start: 0, end: 0 },
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
      ])
    })

    it('Non-overlapping ranges', () => {
      const ranges: IRange[] = [
        {
          start: 0,
          end: 1,
        },
        {
          start: 2,
          end: 9,
        },
        {
          start: 16,
          end: 20,
        },
      ]

      expect(getElementaryRanges(ranges, 21)).toEqual([
        { start: 0, end: 1 },
        { start: 2, end: 9 },
        { start: 10, end: 15 },
        { start: 16, end: 20 },
      ])
    })
  })

  describe('Merge ranges', () => {
    it('Overlapping ranges', () => {
      const ranges: IRange[] = [
        {
          start: 0,
          end: 1,
        },
        {
          start: 1,
          end: 2,
        },
        {
          start: 2,
          end: 3,
        },
      ]

      expect(mergeRanges(ranges)).toEqual([{ start: 0, end: 3 }])
    })

    it('Non-overlapping ranges', () => {
      const ranges: IRange[] = [
        {
          start: 0,
          end: 1,
        },
        {
          start: 5,
          end: 6,
        },
        {
          start: 10,
          end: 20,
        },
      ]

      expect(mergeRanges(ranges)).toEqual(ranges)
    })
  })
})
