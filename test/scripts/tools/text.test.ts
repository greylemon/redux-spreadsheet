import {
  createEditorStateFromText,
  createValueFromEditorState,
  createEditorStateFromRichText,
} from '../../../src/tools/text'
import { ICell, IRichTextValue } from '../../../src/@types/state'
import {
  TYPE_FORMULA,
  TYPE_TEXT,
  TYPE_NUMBER,
  TYPE_RICH_TEXT,
} from '../../../src/constants/types'
import cloneDeep from 'clone-deep'

describe('Text tools', () => {
  describe('Draftjs', () => {
    it('Formulas', () => {
      const formula = 'SUM(A5)'
      const formattedFormula = `=${formula}`
      const editorState = createEditorStateFromText(formattedFormula)

      const cell: Partial<ICell> = createValueFromEditorState(editorState)

      expect(cell.type).toBe(TYPE_FORMULA)
      expect(cell.value).toBe(formula)

      const formula2 = 'COUNTIF(A5,0)'
      const formattedFormula2 = `=${formula2}`
      const editorState2 = createEditorStateFromText(formattedFormula2)

      const cell2: Partial<ICell> = createValueFromEditorState(editorState2)

      expect(cell2.type).toBe(TYPE_FORMULA)
      expect(cell2.value).toBe(formula2)
    })

    it('Text', () => {
      const text =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis natus cupiditate magnam? Debitis, fuga, ex dolorem vero minima eos eius aperiam vitae illo optio explicabo rem. Dolorum ea minus quis.'
      const editorState = createEditorStateFromText(text)

      const cell: Partial<ICell> = createValueFromEditorState(editorState)

      expect(cell.type).toBe(TYPE_TEXT)
      expect(cell.value).toBe(text)

      const text2 = 'Hello'
      const editorState2 = createEditorStateFromText(text2)

      const cell2: Partial<ICell> = createValueFromEditorState(editorState2)

      expect(cell2.type).toBe(TYPE_TEXT)
      expect(cell2.value).toBe(text2)
    })

    it('Number', () => {
      const number = 12345

      const editorState = createEditorStateFromText(number.toString())

      const cell: Partial<ICell> = createValueFromEditorState(editorState)

      expect(cell.type).toBe(TYPE_NUMBER)
      expect(cell.value).toBe(number)

      const number2 = 9

      const editorState2 = createEditorStateFromText(number2.toString())

      const cell2: Partial<ICell> = createValueFromEditorState(editorState2)

      expect(cell2.type).toBe(TYPE_NUMBER)
      expect(cell2.value).toBe(number2)
    })

    it('Richtext', () => {
      const richtext: IRichTextValue = [
        {
          fragments: [
            {
              text: 'Hello!',
              styles: {
                textDecoration: 'line-through underline',
                fontWeight: 'bold',
                fontStyle: 'italic',
              },
            },
          ],
        },
      ]

      const editorState = createEditorStateFromRichText(cloneDeep(richtext))

      const cell: Partial<ICell> = createValueFromEditorState(editorState)

      expect(cell.type).toBe(TYPE_RICH_TEXT)

      const value = cell.value as IRichTextValue

      delete value[0].key
      delete value[0].fragments[0].key

      expect(value).toEqual(richtext)
    })
  })
})
