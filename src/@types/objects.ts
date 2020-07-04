export type IFormulaMap = {
  // sheet name
  [key: string]: {
    // row
    [key: string]: {
      // column
      [key: string]: string
    }
  }
}
