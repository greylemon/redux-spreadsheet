import React, { FunctionComponent } from 'react'
import { CustomMenuItem } from './CustomMenuItem'
// import { useTypedSelector } from '../../../redux/redux'
// import { shallowEqual } from 'react-redux'

export const Insert: FunctionComponent = () => {
  // const { } = useTypedSelector(() => {}, shallowEqual)

  return (
    <>
      <CustomMenuItem text="Insert" />
    </>
  )
}
