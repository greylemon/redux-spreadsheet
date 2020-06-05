# spreadsheet-redux

## Installation

Currently, the excel project is configured for [yarn](https://yarnpkg.com/) package manager

Command: ```yarn deps```

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

## Tutorials

- [JavaScript](https://javascript.info/)
- [React Patterns](https://reactpatterns.com/)
- [Redux](https://egghead.io/courses/getting-started-with-redux). Please check out the Redux toolkit as that will simplify Redux a ton.
- [Reselect](https://www.youtube.com/watch?v=aOkzmHvF_Zo)

## Typescript

- [TypeScript](https://www.typescriptlang.org/)
- [Usage with Redux](https://redux.js.org/recipes/usage-with-typescript)
- [Usage with Redux Toolkit](https://redux-toolkit.js.org/usage/usage-with-typescript)

## Useful VSCode Packages

- ESLint
- Error Lens
- GitLens
- REST Client
- Babel JavaScript
- CodeMetrics
- Color Highlight
- Better Comments
- markdownlint
