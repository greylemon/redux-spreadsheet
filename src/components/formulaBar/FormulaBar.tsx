import React, { useCallback, FunctionComponent } from 'react'
import { Editor, RichUtils, EditorState } from 'draft-js'
import { shallowEqual, useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/redux'
import { selectCellEditorState } from '../../redux/selectors/base'
import { ExcelActions } from '../../redux/store'

const FormulaBar: FunctionComponent = () => {
  const dispatch = useDispatch()
  const editorState = useTypedSelector(
    (state) => selectCellEditorState(state),
    shallowEqual
  )

  const handleChange = useCallback(
    (newEditorState) =>
      dispatch(ExcelActions.CELL_EDITOR_STATE_UPDATE(newEditorState)),
    [dispatch]
  )

  const handleKeyCommand = (
    command: string,
    currentEditorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(currentEditorState, command)

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
