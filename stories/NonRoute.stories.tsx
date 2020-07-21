import React from 'react'
import { Excel } from '../src/Excel'
import { initialExcelState } from '../src/redux/store'

const NonRoute: any = () => <Excel initialState={initialExcelState} />

export default NonRoute
