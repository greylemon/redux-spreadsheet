import Color from 'color'

export const lightenBy = (color: Color, ratio: number): Color => {
  const lightness = color.lightness()
  return color.lightness(lightness + (100 - lightness) * ratio)
}

export const darkenBy = (color: Color, ratio: number): Color =>
  color.lightness(color.lightness() * (1 - ratio))

export const applyTintToColor = (color: Color, ratio: number): string => {
  if (ratio >= 0) {
    color = lightenBy(color, ratio)
  } else {
    color = darkenBy(color, -ratio)
  }

  return color.hex()
}
