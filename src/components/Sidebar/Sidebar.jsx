import React from 'react'
import { Select } from 'antd'
import Filter from '../Filter'

import {
  CalendarOutlined,
  GlobalOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import './Sidebar.scss'

const Sidebar = ({
  mode,
  onModeChange,
  timezone,
  onTimezoneChange,
  type,
  onTypeChange,
}) => {
  return (
    <div className="sidebar">
      <div>
        <Select defaultValue={mode} onChange={onModeChange}>
          <Select.Option value="calendar">
            <CalendarOutlined /> Calendar
          </Select.Option>

          <Select.Option value="list">
            <UnorderedListOutlined /> List
          </Select.Option>

          <Select.Option value="table">
            <TableOutlined /> Table
          </Select.Option>
        </Select>
      </div>

      <div>
        <Select defaultValue={timezone} onChange={onTimezoneChange}>
          <Select.Option value="timezone1">
            <GlobalOutlined /> Timezone 1
          </Select.Option>

          <Select.Option value="timezone2">
            <GlobalOutlined /> Timezone 2
          </Select.Option>

          <Select.Option value="timezone3">
            <GlobalOutlined /> Timezone 3
          </Select.Option>
        </Select>
      </div>
      <Filter types={type} onFilterChange={onTypeChange} />
    </div>
  )
}

export default Sidebar
