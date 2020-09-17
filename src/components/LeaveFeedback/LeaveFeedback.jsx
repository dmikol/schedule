import React from 'react'
import { Form, Input, Button } from 'antd'
import { API } from '../../api/api'

import './LeaveFeedback.scss'

const LeaveFeedback = ({ task, setClickedTask }) => {
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 12,
    },
  }

  const onFinish = (values) => {
    const feedbacks = task.feedback ? [...task.feedback.data] : []
    feedbacks.push({
      author: values.name,
      text: values.feedback,
    })
    const eventToUpdate = {
      ...task,
      feedback: {
        isFeedback: task.feedback ? task.feedback.isFeedback : true,
        data: [...feedbacks],
      },
    }
    API.updateEvent(task.id, eventToUpdate)
    setClickedTask(eventToUpdate)
  }

  const validateMessages = {
    required: 'Заполните поле',
  };

  return (
    <div className="leave-feedback">
      <h3>Оставить свой отзыв о задании:</h3>
      <Form
        {...layout}
        className="leave-feedback__form"
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={['name']}
          label="Имя"
          rules={[
            {
              type: 'string',
              min: 3,
              max: 20,
            },
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['feedback']}
          label="Отзыв"
          rules={[
            {
              type: 'string',
              min: 15,
              max: 300,
            },
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LeaveFeedback
