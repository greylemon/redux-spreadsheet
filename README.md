# spreadsheet-redux

## Installation

Currently, the excel project is configured for [yarn](https://yarnpkg.com/) package manager

Command: ```yarn install```

## Starting the Application

Command: ```yarn start```

## Format and Linting

Change to the excel folder:

- eslint: ```yarn fix:eslint```

- Prettier formatting: ```yarn fix:prettier```

Please check out the package.json of the excel for the scripts and other node configurations.

## Testing

Note: testing is only for the excel folder

Command: ```yarn test```

## Husky

Husky is used here for performing tasks before a git commit. The tasks performed is finding code violations using eslint and formatting code using prettier.

## Main Libraries Used

- [React](https://reactjs.org/) (Specifically [hooks](https://reactjs.org/docs/hooks-overview.html)): used for building HTML components
- [Redux](https://redux.js.org/): used for application state and state management
- [Redux Toolkit](https://redux-toolkit.js.org/): tools which make Redux setup straightforward
- [React Redux](https://react-redux.js.org/): used to integrate Redux with React
- [Redux Mock Store](https://github.com/ananas7/redux-mock-store/tree/feature/extended-replaceReducer): Mocks the Redux store for testing purpose. Fork of [ananas7](https://github.com/ananas7) branch for replace reducer function

## History - Redo and Undo

### Potential Issues

For implementation, there are things that need to be done carefully for history.

History might trigger unintended state operations that would normally be safe.
