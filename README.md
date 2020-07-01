# Redux Spreadsheet (Beta)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/greylemon/redux-spreadsheet/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/redux-spreadsheet?color=blue)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/greylemon/redux-spreadsheet)
[![Build Status](https://travis-ci.org/greylemon/redux-spreadsheet.svg?branch=master)](https://travis-ci.org/greylemon/redux-spreadsheet)
[![Coverage Status](https://coveralls.io/repos/github/greylemon/redux-spreadsheet/badge.svg?branch=master)](https://coveralls.io/github/greylemon/redux-spreadsheet?branch=master)

## Setup

### Installation

`npm install redux-spreadsheet` or `yarn add redux-spreadsheet`

### Usage

```tsx
import { Excel } from 'redux-spreadsheet'
import 'redux-spreadsheet/dist/main.cjs.css'

const SomeComponent = () => {
  const handleSave = (excelState) => {
    // Do something with data
    ...
  }
  return <Excel handleSave={handleSave} isRouted />
}
```

### Documentation

#### Excel

##### Props

- `handleSave?`: gets called with store data when save event triggers
- `isRouted?`: determines whether react-router is used for active sheet

## Development

### Installation dependencies

Currently, the excel project is configured for [yarn](https://yarnpkg.com/) package manager

Command: `yarn install`

### Starting the Application

Command: `yarn start`

### Format and Linting

- eslint: `yarn fix:eslint`

- Prettier formatting: `yarn fix:prettier`

Please check out the package.json of the excel for the scripts and other node configurations.

### Testing

Command: `yarn test`

### Husky

Husky is used here for performing tasks before a git commit. The tasks performed is finding code violations using eslint and formatting code using prettier.

## Focused Features

- TypeScript support/type definitions
- History
  - [x] Redo
  - [x] Undo
- Commands
  - [x] Save
  - [x] Arrow keys
  - [ ] Shift arrow keys
  - [ ] Delete Area
- Selection
  - [x] Single selection
  - [x] Multi-selection
- Inline-styles/rich-text
  - [x] Bold
  - [x] Italic
  - [x] Strikethrough
  - [x] Underline
- Merged Cells
  - [x] Selection area
  - [ ] Active cell
- Router
  - [x] Page router
  - [x] No page router
  - [ ] Return link
- Formulas
  - [ ] Formula reference map
- Formula bar
  - [ ] Input
- File upload
  - [x] Basic data
- Block-styles
- Sheet navigation
  - [x] Change sheet name
  - [ ] Delete sheet name
  - [ ] Update sheet name
- ...

## Main Libraries Used

| Link                                                                                                 | Usage                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [React](https://reactjs.org/) (specifically [hooks](https://reactjs.org/docs/hooks-overview.html))   | used for building HTML components                                                                                            |
| [Redux](https://redux.js.org/)                                                                       | used for application state and state management                                                                              |
| [Redux Toolkit](https://redux-toolkit.js.org/)                                                       | tools which make Redux setup straightforward                                                                                 |
| [React Redux](https://react-redux.js.org/)                                                           | used to integrate Redux with React                                                                                           |
| [Redux Mock Store](https://github.com/ananas7/redux-mock-store/tree/feature/extended-replaceReducer) | mocks the Redux store for testing purpose. Fork of [ananas7](https://github.com/ananas7) branch for replace reducer function |
| [ExcelJs](https://github.com/exceljs/exceljs)                                                        | parses Excel data and creates excel files                                                                                    |
| [fast-formula-parser](https://github.com/LesterLyu/fast-formula-parser)                              | used to compute formula cells in excel format                                                                                |
| [react-window](https://github.com/bvaughn/react-window)                                              | React components for efficiently rendering large lists and tabular data                                                      |
| [undox](https://github.com/greylemon/undox)                                                          | Fork of [JannieBeck](https://github.com/JannicBeck/undox) with ignore history                                                |

## History - Redo and Undo

### Potential Issues

For implementation, there are things that need to be done carefully for history.

History might trigger unintended state operations that would normally be safe.
