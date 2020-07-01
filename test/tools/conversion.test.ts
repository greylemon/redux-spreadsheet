import {
  columnNameToNumber,
  columnNumberToName,
} from '../../src/tools/conversion'

describe('Conversion', () => {
  describe('Column name to number', () => {
    it('Invalid name', () => {
      expect(columnNameToNumber('0')).toBe(null)
      expect(columnNameToNumber('1')).toBe(null)
      expect(columnNameToNumber(undefined)).toBe(null)
    })

    it('Valid name', () => {
      expect(columnNameToNumber('A')).toBe(1)
      expect(columnNameToNumber('H')).toBe(8)
      expect(columnNameToNumber('Z')).toBe(26)
      expect(columnNameToNumber('AA')).toBe(27)
      expect(columnNameToNumber('ZZ')).toBe(26 * 27)
      expect(columnNameToNumber('AAA')).toBe(26 * 27 + 1)
    })
  })

  describe('Column number to name', () => {
    it('Invalid number', () => {
      expect(columnNumberToName(-5)).toBe(null)
      expect(columnNumberToName(0)).toBe(null)
      expect(columnNumberToName(0.5)).toBe(null)
      expect(columnNumberToName(1.2)).toBe(null)
    })

    it('Valid name', () => {
      expect(columnNumberToName(1)).toBe('A')
      expect(columnNumberToName(8)).toBe('H')
      expect(columnNumberToName(26)).toBe('Z')
      expect(columnNumberToName(27)).toBe('AA')
      expect(columnNumberToName(26 * 27)).toBe('ZZ')
      expect(columnNumberToName(26 * 27 + 1)).toBe('AAA')
    })
  })
})
