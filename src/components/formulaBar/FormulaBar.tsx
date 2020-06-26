import React, { useCallback } from 'react'
import { Editor, RichUtils, EditorState } from 'draft-js'
import { shallowEqual, useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'
import { selectCellEditorState } from '../../redux/selectors'
import { ExcelActions } from '../../redux/store'

const FormulaBar = () => {
  const dispatch = useDispatch()
  const editorState = useTypedSelector(
    (state) => selectCellEditorState(state),
    shallowEqual
  )

  const handleChange = useCallback(
    (editorState) =>
      dispatch(ExcelActions.CELL_EDITOR_STATE_UPDATE(editorState)),
    [dispatch]
  )

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      handleChange(newState)
      return 'handled'
    }

    return 'not-handled'
  }

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  )
}

export default FormulaBar
