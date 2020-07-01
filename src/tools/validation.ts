// https://stackoverflow.com/a/3885844
export const isFloat = (n: number): boolean => n === +n && n !== (n | 0)

export const isInteger = (n: number): boolean => n === +n && n === (n | 0)
