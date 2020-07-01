import { isInteger, isFloat } from '../../src/tools/validation'

describe('Number validation', () => {
  it('Integer numbers', () => {
    const integers = [-1, -10, 0, 1, 10]
    const floats = [-1.2, -10.1, 0.6, 1.7, 10.6]

    integers.forEach((int) => expect(isInteger(int)).toBe(true))
    floats.forEach((float) => expect(isInteger(float)).toBe(false))
  })

  it('Float numbers', () => {
    const integers = [-1, -10, 0, 1, 10]
    const floats = [-1.2, -10.1, 0.6, 1.7, 10.6]

    integers.forEach((int) => expect(isFloat(int)).toBe(false))
    floats.forEach((float) => expect(isFloat(float)).toBe(true))
  })
})
