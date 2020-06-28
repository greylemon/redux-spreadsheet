import React, { ChangeEvent, Fragment, FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'
import { loadWorkbook } from '../../redux/thunk'
import { Publish } from '@material-ui/icons'
import { SmallLabelButton } from '../misc/buttons'

const FileUpload: FunctionComponent = () => {
  const dispatch = useDispatch()
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const file = files[0]

      dispatch(loadWorkbook(file))
    }
  }

  return (
    <SmallLabelButton>
      <Fragment>
        <Publish />
        <input
          type="file"
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
          onChange={handleChange}
        />
      </Fragment>
    </SmallLabelButton>
  )
}

const ToolBar: FunctionComponent = () => {
  return (
    <div className="toolbar">
      <FileUpload />
    </div>
  )
}

export default ToolBar
