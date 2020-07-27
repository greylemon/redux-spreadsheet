import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { IGeneralActionPayload } from './history'

export type IStyleReducer = ActionCreatorWithOptionalPayload<
  IGeneralActionPayload
>
