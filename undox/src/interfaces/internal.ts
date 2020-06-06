import {
  Action,
  UndoxState,
  Reducer,
  Comparator,
  IgnoredActionsMap
} from './public';

import { UndoAction, RedoAction, GroupAction } from '../undox.action';

export interface Undo {
  <S, A extends Action>(reducer: Reducer<S, A>, state: UndoxState<S, A>, action: UndoAction, ignoredAcionsMap: IgnoredActionsMap): UndoxState<S, A>
}

export interface Redo {
  <S, A extends Action>(reducer: Reducer<S, A>, state: UndoxState<S, A>, action: RedoAction, ignoredAcionsMap: IgnoredActionsMap): UndoxState<S, A>
}

export interface Group {
  <S, A extends Action>(state: UndoxState<S, A>, action: GroupAction<A>, reducer: Reducer<S, A>, comparator: Comparator<S>): UndoxState<S, A>
}

export interface Delegate {
  <S, A extends Action>(state: UndoxState<S, A>, action: A, reducer: Reducer<S, A>, comparator: Comparator<S>): UndoxState<S, A>
}
