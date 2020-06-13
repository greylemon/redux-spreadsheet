import React, { useCallback } from 'react'
import { Editor, RichUtils, EditorState } from 'draft-js'
import { useTypedSelector } from '../../../redux/store'
import { shallowEqual, useDispatch } from 'react-redux'
import {
  IActiveCellProps,
  INormalActiveCellProps,
  IEditorCellProps,
} from '../../../@types/excel/components'
import {
  selectIsEditMode,
  selectFactoryActiveCellStyle,
  selectCellEditorState,
} from '../../../redux/ExcelStore/selectors'
import { ExcelActions } from '../../../redux/ExcelStore/store'

const EditorCell = ({ style }: IEditorCellProps) => {
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
    <div className="cell__active cell__active--edit" style={style}>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  )
}

const NormalActiveCell = ({ style }: INormalActiveCellProps) => {
  return <div className="cell__active cell__active--normal" style={style} />
}

const ActiveCell = ({ computeActiveCellStyle }: IActiveCellProps) => {
  const { isEditMode, style } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state),
      style: selectFactoryActiveCellStyle(computeActiveCellStyle)(state),
    }),
    shallowEqual
  )

  return isEditMode ? (
    <EditorCell style={style} />
  ) : (
    <NormalActiveCell style={style} />
  )
}

export default ActiveCell
