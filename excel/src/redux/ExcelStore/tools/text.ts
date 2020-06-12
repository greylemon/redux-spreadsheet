import { EditorState, convertToRaw, RawDraftInlineStyleRange } from 'draft-js'
import {
  IValue,
  IRange,
  IRichText,
  IFragment,
} from '../../../@types/excel/state'
import uniqid from 'uniqid'

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

export const getRangesFromInlineRanges = (
  inlineStyleRanges: RawDraftInlineStyleRange[]
) =>
  inlineStyleRanges.reduce((acc, { offset, length }) => {
    acc.push({ start: offset, end: offset + length - 1 })
    return acc
  }, [] as Array<IRange>)

export const getTextFromRichText = (richText: IRichText) => {
  let text = ''

  for (const block of richText) {
    const blockFragments = block.fragments
    for (let i = 0; i < blockFragments.length; i++) {
      text += blockFragments[i].value
    }
  }

  return text
}

const updateStyleInPlace = (
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
  // let value: IValue
  const richText: IRichText = []

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
        value: rawBlock.text.substring(start, end + 1),
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
