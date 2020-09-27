import React, { Component } from 'react'
import { Button, Form, Input } from 'antd'
import { API } from '../../api/api'
import { ITask } from '../../models'
import './AddNewLesson.scss'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: 'Введите корректное значение',
  // types: {
  //   dateTime: 'Введите в формате 19:00 18-09-2020'
  // }
}
type NewLesson = {
  visibleLessonForm: boolean,

}
class AddNewLesson extends Component<NewLesson> {
  private myRefForm: any;
  constructor(props: any){
    super(props);
    this.myRefForm = React.createRef();
    this.state = {
      comment: '',
      dateTime: '',
      description: '',
      descriptionUrl: '',
      feedback: {
         data: [],
        isFeedback: false,
      },
      id: '',
      name: '',
      organizer: '',
      place: '',
      type: '',
      timeZone: '',
      week: '',
      photo: 'https://pbs.twimg.com/media/EDO0GXBXYAATMFU.jpg'
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
  }

  componentDidUpdate(){
    if (this.props.visibleLessonForm) {
      this.myRefForm.current.style.display = 'block'
    } else {
      this.myRefForm.current.style.display = 'none'
    }
    
  }
  handleFormSubmit() {
    API.addNewEvent(this.state as ITask).then(() => {
    })
    alert('Пункт добавлен!')
  }

  handleFormChange(event: any) {
    const target = event.target
    const value = target.value
    const name = target.id.slice(14)
    this.setState({
      [name]: value
    });
  }
  render() {
  return (
    <div className="addNewLessonForm" ref={this.myRefForm}>
      <h3>Добавление нового пункта в расписание</h3>
    <Form {...layout}  className="mentorsForm" name="nest-messages"  validateMessages={validateMessages}
    onFinish={this.handleFormSubmit}
    >
      <Form.Item name='dateTime' label="Date and Time" rules={[{ required: true }]}>
        <Input 
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='type' label="Type" rules={[{ required: true }]}>
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='place' label="Place">
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='name' label="Name" rules={[{ required: true }]}>
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item 
      name='description' label="Description" rules={[{ required: true }]}>
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='descriptionUrl' label="Description Url" rules={[{ required: true }]}>
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='organizer' label="Organizer">
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item name='comment' label="Comment">
        <Input
        onChange={this.handleFormChange}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
        <Button 
        type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}
} 

export default AddNewLesson
