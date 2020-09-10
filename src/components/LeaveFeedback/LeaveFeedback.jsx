import React from 'react'
import {  Form, Input, Button  } from 'antd'

import './LeaveFeedback.scss'

const LeaveFeedback = () => {

    const layout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 12,
        },
      };

    const onFinish = values => {
        console.log(values);
      };

    const validateMessages = {
    required: '${label} is required!',
    };

    return (
        <div className="LeaveFeedback">
            <h3>Оставить свой отзыв о задании:</h3>
        <Form {...layout} className="LeaveFeedback__form" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
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
      ]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
        </div>
   
  );
}

export default LeaveFeedback