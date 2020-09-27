import React, { FunctionComponent } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

type TaskDescriptionProps = {
  isEdit: boolean
  text: string
}

const EditLine: FunctionComponent<TaskDescriptionProps> = ({
  isEdit,
  text,
}) => {
  if (isEdit) {
    return (
      <Text editable={{ tooltip: false }}>
        {text || 'Описание отсутствует'}
      </Text>
    )
  } else {
    return <Text>{text || 'Описание отсутствует'}</Text>
  }
}

export default EditLine
