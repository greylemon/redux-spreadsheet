import React, {
  FunctionComponent,
  useCallback,
  KeyboardEvent,
  KeyboardEventHandler,
} from 'react'
import { useDispatch, shallowEqual } from 'react-redux'
import { EditorState, DraftHandleValue, RichUtils, Editor } from 'draft-js'
import { Tooltip } from '@material-ui/core'
import { useTypedSelector } from '../../redux/redux'
import {
  selectCellEditorState,
  selectCellEditorOffset,
  selectIsEditMode,
} from '../../redux/selectors/base'
import { selectCellBlockStyle } from '../../redux/selectors/activeSheet'
import { ExcelActions } from '../../redux/store'
import {
  selectPositionDimensions,
  selectActiveCellId,
} from '../../redux/selectors/custom'

const EditorCell: FunctionComponent = () => {
  const dispatch = useDispatch()

  const {
    isEditMode,
    editorState,
    blockStyle,
    cellEditorOffset,
    dimensions,
    activeCellId,
  } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state),
      editorState: selectCellEditorState(state),
      blockStyle: selectCellBlockStyle(state),
      cellEditorOffset: selectCellEditorOffset(state),
      dimensions: selectPositionDimensions(state),
      activeCellId: selectActiveCellId(state),
    }),
    shallowEqual
  )

  const handleChange = useCallback(
    (newEditorState) =>
      dispatch(ExcelActions.CELL_EDITOR_STATE_UPDATE(newEditorState)),
    [dispatch]
  )

  const handleKeyCommand = useCallback(
    (command: string, currentEditorState: EditorState): DraftHandleValue => {
      const newState = RichUtils.handleKeyCommand(currentEditorState, command)

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

      if (key === 'Enter' && !altKey) return 'handled'

      return 'not-handled'
    },
    [dispatch]
  )

  const handleBeforeInput = useCallback((chars: string): DraftHandleValue => {
    if (chars === '\n') return 'handled'

    return 'not-handled'
  }, [])

  const handleKeyDown: KeyboardEventHandler = useCallback((event) => {
    const { key, altKey } = event

    if (!(key === 'Escape' || (key === 'Enter' && !altKey)))
      event.stopPropagation()
  }, [])

  return (
    isEditMode && (
      <div
        className="cell__active cell__active--edit"
        style={{
          position: 'absolute',
          ...blockStyle,
          ...dimensions,
          top: cellEditorOffset.y,
          left: cellEditorOffset.x,
        }}
        onKeyDown={handleKeyDown}
      >
        <Tooltip title={activeCellId} placement="top-start" open>
          <Editor
            editorState={editorState}
            onChange={handleChange}
            handleKeyCommand={handleKeyCommand}
            handleReturn={handleReturn}
            handleBeforeInput={handleBeforeInput}
          />
        </Tooltip>
      </div>
    )
  )
}

export default EditorCell
