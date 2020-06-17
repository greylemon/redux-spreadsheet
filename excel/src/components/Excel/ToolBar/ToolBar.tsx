import React, { ChangeEvent } from 'react'
import Input from '@material-ui/core/Input'
import { useDispatch } from 'react-redux'
import { loadWorkbook } from '../../../redux/ExcelStore/thunk'

const FileUpload = () => {
  const dispatch = useDispatch()
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const file = files[0]

      dispatch(loadWorkbook(file))
    }
  }

  return (
    <Input
      type="file"
      inputProps={{ accept: '.xlsx' }}
      onChange={handleChange}
    />
  )
}

const ToolBar = () => {
  return (
    <div className="toolbar">
      <FileUpload />
    </div>
  )
}

export default ToolBar
