import React, { ChangeEvent, FunctionComponent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Publish } from '@material-ui/icons'
import { THUNK_COMMAND_LOAD } from '../../redux/thunks/IO'
import { SmallLabelButton } from '../misc/buttons'

const FileUploadAction: FunctionComponent = () => {
  const dispatch = useDispatch()
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target

      if (files) {
        const file = files[0]

        dispatch(THUNK_COMMAND_LOAD(file))
      }
    },
    [dispatch]
  )

  return (
    <SmallLabelButton title="Upload">
      <>
        <Publish />
        <input
          type="file"
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
          onChange={handleChange}
        />
      </>
    </SmallLabelButton>
  )
}

const IOSection: FunctionComponent = () => (
  <div>
    <FileUploadAction />
  </div>
)

export default IOSection
