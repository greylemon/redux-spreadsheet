import {
  EditorState,
  convertToRaw,
  RawDraftInlineStyleRange,
  RawDraftContentBlock,
  RawDraftContentState,
  DraftInlineStyleType,
  convertFromRaw,
  ContentState,
} from 'draft-js'
import {
  IValue,
  IRange,
  IRichTextValue,
  IFragment,
  IRichTextBlock,
} from '../../@types/state'
import uniqid from 'uniqid'
import { getElementaryRanges, mergeRanges } from './range'
import { IInlineStylesRange } from '../../@types/general'

export const getRangesFromInlineRanges = (
  inlineStyleRanges: RawDraftInlineStyleRange[]
) =>
  inlineStyleRanges.reduce((acc, { offset, length }) => {
    acc.push({ start: offset, end: offset + length - 1 })
    return acc
  }, [] as Array<IRange>)

export const getTextFromRichText = (richText: IRichTextValue) => {
  let text = ''

  for (const block of richText) {
    const blockFragments = block.fragments
    for (let i = 0; i < blockFragments.length; i++) {
      text += blockFragments[i].text
    }
  }

  return text
}

export const updateStyleInPlace = (
  inlineRange: RawDraftInlineStyleRange,
  fragment: IFragment
) => {
  switch (inlineRange.style) {
    case 'BOLD':
      fragment.styles!.fontWeight = 'bold'
      break
    case 'ITALIC':
      fragment.styles!.fontStyle = 'italic'
      break
    case 'STRIKETHROUGH':
      if (fragment.styles!.textDecoration) {
        fragment.styles!.textDecoration += ' line-through'
      } else {
        fragment.styles!.textDecoration = 'line-through'
      }
      break
    case 'UNDERLINE':
      if (fragment.styles!.textDecoration) {
        fragment.styles!.textDecoration += ' underline'
      } else {
        fragment.styles!.textDecoration = 'underline'
      }
      break

    default:
      break
  }
}

export const createValueFromEditorState = (
  editorState: EditorState
): IValue => {
  const richText: IRichTextValue = []

  const rawBlocks = convertToRaw(editorState.getCurrentContent()).blocks

  for (const rawBlock of rawBlocks) {
    const blockFragments: IFragment[] = []
    const mergedRanges = getElementaryRanges(
      getRangesFromInlineRanges(rawBlock.inlineStyleRanges),
      rawBlock.text.length
    )

    const inlineStyleRanges = rawBlock.inlineStyleRanges

    for (const mergedRange of mergedRanges) {
      const { start, end } = mergedRange

      const fragment: IFragment = {
        key: uniqid(),
        text: rawBlock.text.substring(start, end + 1),
      }

      for (let i = 0; i < inlineStyleRanges.length; i++) {
        const inlineRange = inlineStyleRanges[i]
        const inlineStart = inlineRange.offset
        const inlineEnd = inlineStart + inlineRange.length - 1

        if (inlineStart <= start && end <= inlineEnd) {
          if (!fragment.styles) fragment.styles = {}

          updateStyleInPlace(inlineRange, fragment)
        }
      }

      blockFragments.push(fragment)
    }

    richText.push({ key: uniqid(), fragments: blockFragments })
  }

  let isRichText = richText.length > 1

  for (const block of richText) {
    for (const fragment of block.fragments) {
      if (fragment.styles) isRichText = true
    }
  }

  return isRichText ? richText : getTextFromRichText(richText)
}

export const getRichTextBlockText = (block: IRichTextBlock) => {
  let text = ''

  const fragments = block.fragments
  for (const fragment of fragments) {
    text += fragment.text
  }

  return text
}

// Currently the fragment styles are in elementary ranges, unlike overlapping ranges.. may not matter at all
export const getRawInlineStyleRangesFromRichTextBlock = (
  block: IRichTextBlock
) => {
  // Any fragment with style is an inline style
  const inlineStyleRanges: RawDraftInlineStyleRange[] = []
  let text = ''

  const fragments = block.fragments

  const data: IInlineStylesRange = {
    BOLD: [],
    ITALIC: [],
    STRIKETHROUGH: [],
    UNDERLINE: [],
  }

  let previousOffset: number = -1

  for (const fragment of fragments) {
    const start = previousOffset + 1
    let end = start

    if (fragment.text) {
      text += fragment.text
      end = text.length - 1
    }

    previousOffset = end

    const range: IRange = { start, end }

    if (fragment.styles) {
      const {
        fontWeight,
        // fontFamily,
        // fontSize,
        fontStyle,
        textDecoration,
        // verticalAlign,
        // color
      } = fragment.styles

      if (fontWeight === 'bold') {
        data.BOLD.push(range)
      }

      if (fontStyle === 'italic') {
        data.ITALIC.push(range)
      }

      if (textDecoration) {
        if (textDecoration.includes('underline')) {
          data.UNDERLINE.push(range)
        }

        if (textDecoration.includes('line-through')) {
          data.STRIKETHROUGH.push(range)
        }
      }
    }
  }

  for (const style in data) {
    const ranges = mergeRanges(data[style])

    for (const range of ranges) {
      const length = range.end - range.start + 1
      inlineStyleRanges.push({
        offset: range.start,
        length,
        style: style as DraftInlineStyleType,
      })
    }
  }

  return { text, inlineStyleRanges }
}

export const createRawContentBlockFromRichTextBlock = (
  block: IRichTextBlock
): RawDraftContentBlock => {
  const { inlineStyleRanges, text } = getRawInlineStyleRangesFromRichTextBlock(
    block
  )
  return {
    key: uniqid(),
    type: 'unstyled',
    text,
    depth: 0,
    entityRanges: [],
    inlineStyleRanges,
  }
}

export const getRawContentStateFromRichText = (
  richText: IRichTextValue
): RawDraftContentState => ({
  blocks: richText.map((block) =>
    createRawContentBlockFromRichTextBlock(block)
  ),
  entityMap: {},
})

export const createEditorStateFromRichText = (value: IRichTextValue) =>
  EditorState.createWithContent(
    convertFromRaw(getRawContentStateFromRichText(value))
  )

export const createEditorStateFromText = (value: string) =>
  EditorState.createWithContent(ContentState.createFromText(value))

export const createEmptyEditorState = () =>
  EditorState.moveFocusToEnd(EditorState.createEmpty())

export const createEditorStateFromNonEmptyValue = (value: IValue) => {
  let editorValue: IValue

  return EditorState.moveFocusToEnd(
    typeof value === 'object'
      ? createEditorStateFromRichText(value as IRichTextValue)
      : createEditorStateFromText(value)
  )
}
