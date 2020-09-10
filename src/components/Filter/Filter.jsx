import React from 'react'
import { Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'

import './filter.scss'

const events = [
  { name: 'Выдача таска', id: 1 },
  { name: 'Факультатив', id: 2 },
  { name: 'Тест', id: 3 },
  { name: 'Митап в Минске', id: 4 },
  { name: 'YouTube Live', id: 5 },
  { name: 'Self education', id: 6 },
  { name: 'Deadline', id: 7 },
]

const type = events.map((event) => {
  return (
    <Select.Option value={event.name} key={event.id}>
      <FilterOutlined /> {event.name}
    </Select.Option>
  )
})

const Filter = () => {
  return (
    <div>
      <Select defaultValue="Фильтр">{type}</Select>
    </div>
  )
}

export default Filter
