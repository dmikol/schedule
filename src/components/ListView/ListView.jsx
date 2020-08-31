import React from 'react'
import { Avatar, List } from 'antd'

import './ListView.scss'

const ListView = ({ events = [] }) => {
  return (
    <div className="list-view">
      <h3>List view</h3>

      <List
        itemLayout="horizontal"
        dataSource={events}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://picsum.photos/128" />}
              title={item}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum, consectetur."
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default ListView
