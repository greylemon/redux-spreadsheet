import React, {
  useCallback,
  FunctionComponent,
  CSSProperties,
  KeyboardEvent,
} from 'react'
import { Editor, RichUtils, EditorState, DraftHandleValue } from 'draft-js'
import { shallowEqual, useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'
import {
  INormalActiveCellProps,
  IEditorCellProps,
  ICommonPaneProps,
} from '../../@types/components'
import {
  selectActiveCellAreaBottomLeftStyle,
  selectActiveCellAreaBottomRightStyle,
  selectActiveCellAreaTopLeftStyle,
  selectActiveCellAreaTopRightStyle,
  selectIsActiveCellInBottomLeftPane,
  selectIsActiveCellInBottomRightPane,
  selectIsActiveCellInTopLeftPane,
  selectIsActiveCellInTopRightPane,
} from '../../redux/selectors/pane'
import { selectIsEditMode, selectEditorState } from '../../redux/selectors/base'
import { ExcelActions } from '../../redux/store'
import { selectCellBlockStyle } from '../../redux/selectors/activeSheet'

const EditorCell: FunctionComponent<IEditorCellProps> = ({ style }) => {
  const dispatch = useDispatch()

  const { editorState, blockStyle } = useTypedSelector(
    (state) => ({
      editorState: selectEditorState(state),
      blockStyle: selectCellBlockStyle(state),
    }),
    shallowEqual
  )

  const handleChange = useCallback(
    (editorState) =>
      dispatch(ExcelActions.CELL_EDITOR_STATE_UPDATE(editorState)),
    [dispatch]
  )

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState): DraftHandleValue => {
      const newState = RichUtils.handleKeyCommand(editorState, command)

      if (newState) {
        handleChange(newState)
        return 'handled'
      }

      return 'not-handled'
    },
    [handleChange]
  )

  const handleReturn = useCallback(
    (event: KeyboardEvent): DraftHandleValue => {
      const { key, altKey } = event

      if (key === 'Enter' && !altKey) {
        return 'handled'
      }

      return 'not-handled'
    },
    [dispatch]
  )

  const handleBeforeInput = useCallback((chars: string): DraftHandleValue => {
    if (chars === '\n') {
      return 'handled'
    }

    return 'not-handled'
  }, [])

  return (
    <div
      className="cell__active cell__active--edit"
      style={{ ...style, ...blockStyle }}
    >
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        handleReturn={handleReturn}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  )
}

const NormalActiveCell = ({ style }: INormalActiveCellProps) => {
  return <div className="cell__active cell__active--normal" style={style} />
}

const ActiveCell: FunctionComponent<ICommonPaneProps> = ({ type }) => {
  const { isEditMode, style, isInCorrectPane } = useTypedSelector((state) => {
    let style: CSSProperties
    let isInCorrectPane: boolean

    switch (type) {
      case 'BOTTOM_LEFT':
        style = selectActiveCellAreaBottomLeftStyle(state)
        isInCorrectPane = selectIsActiveCellInBottomLeftPane(state)
        break
      case 'BOTTOM_RIGHT':
        style = selectActiveCellAreaBottomRightStyle(state)
        isInCorrectPane = selectIsActiveCellInBottomRightPane(state)
        break
      case 'TOP_LEFT':
        style = selectActiveCellAreaTopLeftStyle(state)
        isInCorrectPane = selectIsActiveCellInTopLeftPane(state)
        break
      case 'TOP_RIGHT':
        style = selectActiveCellAreaTopRightStyle(state)
        isInCorrectPane = selectIsActiveCellInTopRightPane(state)
        break
    }

    return {
      isEditMode: selectIsEditMode(state),
      style,
      isInCorrectPane,
    }
  }, shallowEqual)

  if (!isInCorrectPane) return <></>

  return isEditMode ? (
    <EditorCell style={style} />
  ) : (
    <NormalActiveCell style={style} />
  )
}

export default ActiveCell
