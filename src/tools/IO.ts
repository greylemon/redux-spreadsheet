import { Workbook } from 'exceljs'
import fs from 'fs'
import { IExcelState } from '../@types/state'
import { createStateFromWorkbook } from './parser'
import { updateWorkbookReference } from './formula/formula'

export const convertRawExcelToState = async (
  file: File | string
): Promise<IExcelState> => {
  const workbook = new Workbook()
  let data: Workbook

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer()
    data = await workbook.xlsx.load(arrayBuffer)
  } else {
    data = await workbook.xlsx.readFile(file)
  }

  return updateWorkbookReference(createStateFromWorkbook(data))
}

export const readFileFromPath = async (path: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
