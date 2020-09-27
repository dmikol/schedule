import React, { Component } from 'react'
import { Button, Form, Input, DatePicker } from 'antd'
import { FormInstance } from 'antd/lib/form'

import { ITask } from '../../models'
import './AddNewLesson.scss'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const validateMessages = {
  required: 'Введите корректное значение',
}

type NewLesson = {
  visibleLessonForm: boolean
  handleAddNewTask(values: object): void
}

class AddNewLesson extends Component<NewLesson> {
  private myRefForm: any
  constructor(props: any) {
    super(props)
    this.myRefForm = React.createRef()
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  form = React.createRef<FormInstance>()

  templateNewTask: ITask = {
    comment: '',
    dateTime: '',
    description: '',
    descriptionUrl: '',
    feedback: {
      data: [
        {
          author: '',
          text: '',
        },
      ],
      isFeedback: false,
    },
    id: '',
    name: '',
    organizer: '',
    place: '',
    type: '',
    timeZone: '',
    week: '',
    photo: '',
  }

  componentDidUpdate() {
    if (this.props.visibleLessonForm) {
      this.myRefForm.current.style.display = 'block'
    } else {
      this.myRefForm.current.style.display = 'none'
    }
  }

  handleFormSubmit(inputValues: any) {
    const dateAndTime = inputValues.date.format('HH:mm DD-MM-YYYY')
    const newTask: ITask = {
      ...this.templateNewTask,
      ...inputValues,
      dateTime: dateAndTime,
    }

    this.props.handleAddNewTask(newTask)

    if (this.form.current) this.form.current.resetFields()
  }

  render() {
    return (
      <div className="addNewLessonForm" ref={this.myRefForm}>
        <h3>Добавление нового пункта в расписание</h3>

        <Form
          {...layout}
          ref={this.form}
          className="mentorsForm"
          name="nest-messages"
          validateMessages={validateMessages}
          onFinish={this.handleFormSubmit}
        >
          <Form.Item
            name="date"
            label="Date & time"
            rules={[{ required: true }]}
          >
            <DatePicker showTime format="HH:mm DD-MM-YYYY" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="place" label="Place">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descriptionUrl"
            label="Description Url"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="organizer" label="Organizer">
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default AddNewLesson
