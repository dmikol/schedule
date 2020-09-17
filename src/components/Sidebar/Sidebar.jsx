import React from 'react'

import Filter from '../Filter'

import { Select, Space, Switch } from 'antd'

import {
  CalendarOutlined,
  GlobalOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import './Sidebar.scss'

const Sidebar = ({
  children,
  mode,
  onModeChange,
  timezone,
  onTimezoneChange,
  type,
  onTypeChange,
}) => {
  const handleHighContrastModeChange = () => {
    document.body.classList.toggle('high-contrast')
  }

  return (
    <div className="sidebar">
      <Space direction="vertical">
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
            <Select.Option value="-2London">
              <GlobalOutlined /> Europe/London
            </Select.Option>

            <Select.Option value="-1Warsaw">
              <GlobalOutlined /> Europe/Warsaw
            </Select.Option>

            <Select.Option value="+0Kiev">
              <GlobalOutlined /> Europe/Kiev
            </Select.Option>

            <Select.Option value="+0Minsk">
              <GlobalOutlined /> Europe/Minsk
            </Select.Option>

            <Select.Option value="+0Moscow">
              <GlobalOutlined /> Europe/Moscow
            </Select.Option>

            <Select.Option value="+1Volgograd">
              <GlobalOutlined /> Europe/Volgograd
            </Select.Option>

            <Select.Option value="+1Yekaterinburg">
              <GlobalOutlined /> Europe/Yekaterinburg
            </Select.Option>

            <Select.Option value="+2Tashkent">
              <GlobalOutlined /> Asia/Tashkent
            </Select.Option>

          </Select>
        </div>
        <Filter types={type} onFilterChange={onTypeChange} />

        {children}

        <div>
          <label>
            <Space>
              <Switch onChange={handleHighContrastModeChange} />
              High contrast mode
            </Space>
          </label>
        </div>
      </Space>
    </div>
  )
}

export default Sidebar
