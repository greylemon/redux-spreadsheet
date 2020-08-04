# Redux Spreadsheet (Beta)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/greylemon/redux-spreadsheet/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/redux-spreadsheet?color=blue)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/greylemon/redux-spreadsheet)
[![Build Status](https://travis-ci.org/greylemon/redux-spreadsheet.svg?branch=master)](https://travis-ci.org/greylemon/redux-spreadsheet)
[![Coverage Status](https://coveralls.io/repos/github/greylemon/redux-spreadsheet/badge.svg?branch=master)](https://coveralls.io/github/greylemon/redux-spreadsheet?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/34a279ac732e0c37a4bf/maintainability)](https://codeclimate.com/github/greylemon/redux-spreadsheet/maintainability)

Excel/Google-like spreadsheet

## Note - Canvas with react-konva

Currently working on a canvas version as the performance is much faster since it can utilize GPU and can have less overhead than the usual DOM elements.

However, some behaviours with DOM elements are different from canvas, and may not be fully supported in canvas. For example, z-index exists in a different way in canvas - things are layered on top of one another by the order they are drawn.

- [x] Create four panes - top left, top right, bottom left, and bottom right
- [x] Optimize by limiting render to 'visible' items (excluding columns for bottom right)
- [x] Custom scrollbar
- [ ] Optimize performance (cache, improve selectors, change component design to reduce drawing...)
- Cell layering
  - [x] Grid layer
  - [x] Text layer
  - [x] Block layer
  - [ ] Event layer
  - [ ] Spacing layer

## Demos

[Storybook](https://greylemon.github.io/redux-spreadsheet/)

## Setup

### Installation

`npm install redux-spreadsheet` or `yarn add redux-spreadsheet`

### Usage

#### Without Initial State

```tsx
import { Excel } from 'redux-spreadsheet'
import 'redux-spreadsheet/dist/main.cjs.css'

const SomeComponent = () => {
  const handleSave = (excelState) => {
    // Do something with data
  }
  return <Excel handleSave={handleSave} isRouted />
}
```

### Documentation

#### Excel

##### Props

- `initialState?`: initial excel state (note that Undox wraps the excel state for redo and undo)
- `styles?`: style of the Excel's root div
- `handleSave?`: gets called with store data when save event triggers
- `isRouted?`: determines whether react-router is used for active sheet

## Focused Features

- TypeScript support/type definitions (unsure how to generate)
- Mobile
  - [ ] Detect double tap
- History (Some actions have not been included yet)
  - [x] Redo
  - [x] Undo
- Commands
  - [x] Save
  - [x] Arrow keys
  - [x] Delete Area
  - [x] Select all
  - [ ] Shift arrow keys
- Selection
  - [x] Single selection
  - [x] Multi-selection
  - [x] Selection slicing
  - [ ] Select rows / columns
- Inline-styles/rich-text
  - [x] Bold
  - [x] Italic
  - [x] Strikethrough
  - [x] Underline
- Merged Cells
  - [x] Selection area
  - [x] Active cell
  - [ ] Update formula references
- Router
  - [x] Page router
  - [x] No page router
  - [ ] Return link
- Formulas
  - [x] Formula dependents map
  - [x] Formula independents map
  - [x] Formula results
  - [x] Clean up formula independent references
  - [ ] Column/row references (=SUM(A:A) or =SUM(1:1))
  - [ ] Variables
  - [x] Optimize range edit/delete
  - [x] Normalize dependents/independents
  - [ ] Error on cyclic reference
  - [ ] Update cell only when value change
- Formula bar
  - [ ] Input
- File upload
  - [x] Initial state
  - [x] Basic data
- File Download
  - [ ] .xlsx
- Block-styles
- Sheet navigation
  - [x] Switch sheet name
  - [x] Delete sheet name
  - [x] Update sheet name
  - [ ] Update formula references for rename
- Row / Column
  - [x] Resize
  - [ ] Resize Freeze
  - [ ] Set row / column count
- Scroll
  - [x] Selection area (may crash -- need to limit trigger)
  - [ ] Key press
- Alternative container experiments
  - [ ] react-canvas container - Google Spreadsheet uses canvas
- ...many more to do

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
| [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc)                                | Draggable list for sheet navigation                                                                                          |
| [material-ui](https://github.com/mui-org/material-ui)                                                | Customized styled base components                                                                                            |
