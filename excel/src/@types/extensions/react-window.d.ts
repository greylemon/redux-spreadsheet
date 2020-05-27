import 'react-window'
import { ReactElement } from 'react'

declare module 'react-window' {
  interface VariableSizeGridProps {
    extraBottomRightElement?: ReactElement
    extraBottomLeftElement?: ReactElement
    extraTopLeftElement?: ReactElement
    extraTopRightElement?: ReactElement
    freezeColumnCount?: number
    freezeRowCount?: number
  }
}
