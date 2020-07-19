export const getDocumentOffsetPosition = (
  el: HTMLElement
): { top: number; left: number } => {
  const position = {
    top: el.offsetTop,
    left: el.offsetLeft,
  }

  if (el.offsetParent) {
    const parentPosition = getDocumentOffsetPosition(
      el.offsetParent as HTMLElement
    )
    position.top += parentPosition.top
    position.left += parentPosition.left
  }

  return position
}
