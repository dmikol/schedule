import React, { FunctionComponent, useState } from 'react'
import { Typography } from 'antd'

const { Text } = Typography;

type TaskDescriptionProps = {
  isEdit: boolean
  text: string
}

const onChange = () => {
  console.log();
}

const EditLine: FunctionComponent<TaskDescriptionProps> = ({ isEdit, text }) => {

  if (isEdit) {
    return (
      <Text editable={{ tooltip: false, onChange: onChange }} >{text || 'Описание отсутствует'}</Text>
    )
  } else {
    return (
      <Text>{text || 'Описание отсутствует'}</Text>
    )
  }
}

export default EditLine;