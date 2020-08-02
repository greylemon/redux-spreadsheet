export const getScrollbarSize = (() => {
  let size = -1

  return (recalculate = false) => {
    if (size === -1 || recalculate) {
      // const div = document.createElement('div')
      // const { style } = div
      // style.width = '50px'
      // style.height = '50px'
      // style.overflow = 'scroll'

      // document.body.appendChild(div)

      // size = div.offsetWidth - div.clientWidth

      // document.body.removeChild(div)
      size = 30
    }

    return size
  }
})()
