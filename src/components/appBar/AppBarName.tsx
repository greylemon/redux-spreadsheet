import React, {
  FunctionComponent,
  useCallback,
  KeyboardEventHandler,
  KeyboardEvent,
  useRef,
} from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { Editor, EditorState, DraftHandleValue } from 'draft-js'
import { useTypedSelector } from '../../redux/redux'
import { selectTitleEditorState } from '../../redux/selectors/base'
import { ExcelActions } from '../../redux/store'
import { ISheetRef } from '../../@types/ref'

const AppBarName: FunctionComponent<{ sheetRef: ISheetRef }> = ({
  sheetRef,
}) => {
  const dispatch = useDispatch()
  const editorRef = useRef<Editor>()
  const titleEditorState = useTypedSelector(
    (state) => selectTitleEditorState(state),
    shallowEqual
  )

  const handleChange = useCallback(
    (editorState: EditorState) => {
      dispatch(ExcelActions.UPDATE_TITLE_EDITOR_STATE(editorState))
    },
    [dispatch]
  )

  const handleKeyCommand: KeyboardEventHandler = useCallback(
    (event) => {
      switch (event.key) {
        case 'Escape':
          dispatch(ExcelActions.ESCAPE_TITLE_EDITOR_STATE())
          sheetRef.current.focus()
          break
        case 'Enter':
          dispatch(ExcelActions.SAVE_TITLE_EDITOR_STATE())
          sheetRef.current.focus()
          break
        default:
          event.stopPropagation()
          break
      }
    },
    [dispatch, editorRef, sheetRef]
  )

  const handleReturn = useCallback(
    (event: KeyboardEvent): DraftHandleValue => {
      const { key } = event

      if (key === 'Enter') return 'handled'

      return 'not-handled'
    },
    [dispatch]
  )

  return (
    <div className="title" onKeyDown={handleKeyCommand}>
      <Editor
        ref={editorRef}
        editorState={titleEditorState}
        onChange={handleChange}
        handleReturn={handleReturn}
      />
    </div>
  )
}

export default AppBarName
