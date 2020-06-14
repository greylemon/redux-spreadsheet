import React, { ChangeEvent } from 'react'
import Input from '@material-ui/core/Input'
import { convertRawExcelToState } from '../tools/excel'

const FileUpload = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const content = files[0]

      convertRawExcelToState(content)
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
