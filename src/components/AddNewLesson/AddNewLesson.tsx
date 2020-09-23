import React, { Component } from 'react'
import { Button, Form, Input } from 'antd'

import './AddNewLesson.scss'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: 'Введите корректное значение',
  types: {
    email: 'Введите корректное значение',
    number: 'Введите корректное значение',
  },
};
type NewLesson = {
  visibleLessonForm: boolean
}
class AddNewLesson extends Component<NewLesson> {
  private myRefForm: any;
  constructor(props: any){
    super(props);
    this.myRefForm = React.createRef();
  }

  componentDidUpdate(){
    if (this.props.visibleLessonForm) {
      this.myRefForm.current.style.display = 'block'
    } else {
      this.myRefForm.current.style.display = 'none'
    }
  }

  render() {
  return (
    <div className="addNewLessonForm" ref={this.myRefForm}>
      <h3>Добавление нового пункта в расписание</h3>
    <Form {...layout}  className="mentorsForm" name="nest-messages"  validateMessages={validateMessages}>
      <Form.Item name={['newLesson', 'date']} label="Date" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'time']} label="Time" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'type']} label="Type" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'place']} label="Place">
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'name']} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'url']} label="Url" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['newLesson', 'organizer']} label="Organizer">
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
