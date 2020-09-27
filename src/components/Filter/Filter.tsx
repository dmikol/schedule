import React, { FunctionComponent } from 'react'
import { Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'

import './Filter.scss'

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

type FilterProps = {
  type: string
  onFilterChange(type: string): void
}

const Filter: FunctionComponent<FilterProps> = ({ type, onFilterChange }) => {
  return (
    <div>
      <Select defaultValue={type} onChange={onFilterChange}>
        {events.map(({ id, name }) => (
          <Select.Option key={id} value={name}>
            <FilterOutlined /> {name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default Filter
