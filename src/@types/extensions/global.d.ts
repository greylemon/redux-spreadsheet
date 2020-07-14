import { IResults } from '../state'

declare global {
  interface Window {
    results: IResults
  }
}
