import {
  Group,
  Undo,
  Redo,
  Delegate
} from './interfaces/internal';

import {
  Action,
  Reducer,
  Comparator,
  UndoxState,
  IgnoredActionsMap
} from './interfaces/public';

import {
  UndoxTypes,
  GroupAction,
  RedoAction,
  UndoAction,
  UndoxAction
} from './undox.action';


// helper used to flatten the history if grouped actions are in it
const flatten = <T> (x: (T | T[])[]) => ([] as T[]).concat(...x) as T[]

// actions can be an array of arrays because of grouped actions, so we flatten it first
const calculateState = <S, A extends Action>(reducer: Reducer<S, A>, actions: (A | A[])[], state?: S) => flatten(actions).reduce(reducer, state) as S

const getFutureActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(state.index + 1)

const getPastActionsWithPresent = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(0, state.index + 1)

const getPastActions = <S, A extends Action>(state: UndoxState<S, A>) => state.history.slice(0, state.index)

const getPresentState = <S, A extends Action>(state: UndoxState<S, A>) => state.present

export const createSelectors = <S, A extends Action>(reducer: Reducer<S, A>) => {

  return {
    getPastStates : (state: UndoxState<S, A>): S[] =>
      getPastActions(state) 
        .reduce(
          (states, a, i) =>
            Array.isArray(a)
              ? [ ...states, a.reduce(reducer, states[i - 1]) ]
              : [ ...states, reducer(states[i - 1], a) ]
          , [ ] as S[]
        ),

    getFutureStates : (state: UndoxState<S, A>): S[] =>
      getFutureActions(state)
        .reduce(
          (states, a, i) =>
            Array.isArray(a)
              ? [ ...states, a.reduce(reducer, states[i]) ]
              : [ ...states, reducer(states[i], a) ]
          , [ getPresentState(state) ]
        ).slice(1),

    getPresentState,
    getPastActions : (state: UndoxState<S, A>): A[] => flatten(getPastActions(state)),
    getPresentAction : (state: UndoxState<S, A>): A | A[] => state.history[state.index],
    getFutureActions : (state: UndoxState<S, A>): A[] => flatten(getFutureActions(state))
  }

}

const group: Group = (state, action, reducer, comparator) => {

  const presentState = getPresentState(state)
  const nextState = action.payload.reduce(reducer, state.present)

  if (comparator(presentState, nextState))
    return state

  return {
    history : [ ...getPastActionsWithPresent(state), action.payload ],
    index   : state.index + 1,
    present : nextState
  }

}

const undo: Undo = (reducer, state, { payload = 1 }, ignoredActionsMap) => {
  let count = 0
  let index = state.index - 1

  while (index > 0) {
    const action = state.history[index] as Action

    if (!ignoredActionsMap[action.type] && payload === ++count) break
    
    index--
  }

  const newState = {
    ...state,
    index: index >= 0 ? index : 0
  }

  return {
    ...newState,
    present : calculateState(reducer, getPastActionsWithPresent(newState))
  }

}

const redo: Redo = (reducer, state, { payload = 1 }, ignoredActionsMap) => {
  let index = state.index + 1 < state.history.length ? state.index + 1 : state.history.length - 1
  let count = 0

  while (index < state.history.length) {
    const action = state.history[index] as Action

    if (!ignoredActionsMap[action.type] && payload === ++count) break
    
    index++
  }

  const latestFuture = state.history.slice(
    state.index + 1 < state.history.length ? state.index + 1 : state.history.length - 1, 
    index < state.history.length ? index + 1 : state.history.length
  )

  return {
    ...state,
    index: index < state.history.length ? index : state.history.length - 1,
    present: calculateState(reducer, latestFuture, getPresentState(state))
  }

}

const delegate: Delegate = (state, action, reducer, comparator) => {

  const nextPresent = reducer(state.present, action)

  if (comparator(state.present, nextPresent))
    return state

  return {
    history : [ ...getPastActionsWithPresent(state), action ],
    index   : state.index + 1,
    present : nextPresent
  }

}


export const undox = <S, A extends Action>(
  reducer: Reducer<S, A>,
  initAction = { type: 'undox/INIT' } as A,
  comparator: Comparator<S> = (s1, s2) => s1 === s2,
  ignoredActionsMap: IgnoredActionsMap = {}
  ) => {
  const initialState: UndoxState<S, A> = {
    history : [ initAction ],
    present : reducer(undefined, initAction),
    index   : 0
  }
  
  return (state = initialState, action: UndoxAction<A>) => {

    switch (action.type) {

      case UndoxTypes.UNDO:
        return undo(reducer, state, action as UndoAction, ignoredActionsMap)

      case UndoxTypes.REDO:
        return redo(reducer, state, action as RedoAction, ignoredActionsMap)

      case UndoxTypes.GROUP:
        return group(state, action as GroupAction<A>, reducer, comparator)

      default:
        return delegate(state as UndoxState<S, A>, action as A, reducer, comparator)

    }

  }

}
