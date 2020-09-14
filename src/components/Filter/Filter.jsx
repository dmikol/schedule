import React from 'react'
import { Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'

import './filter.scss'

const events = [
  { name: 'All', id: 1 },
  { name: 'Выдача таска', id: 2 },
  { name: 'Факультатив', id: 3 },
  { name: 'Тест', id: 4 },
  { name: 'Митап в Минске', id: 5 },
  { name: 'YouTube Live', id: 6 },
  { name: 'Self education', id: 7 },
  { name: 'Deadline', id: 8 },
]

const type = events.map(({ name, id }) => {
  return (
    <Select.Option value={name} key={id}>
      <FilterOutlined /> {name}
    </Select.Option>
  )
})

const Filter = ({ types, onFilterChange }) => {
  return (
    <div>
      <Select defaultValue={types} onChange={onFilterChange}>
        {type}
      </Select>
    </div>
  )
}

export default Filter
