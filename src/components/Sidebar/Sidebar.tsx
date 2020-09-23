import React, { FunctionComponent, ReactNode, createElement } from 'react'
import { Select, Space, Switch } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

import './Sidebar.scss'

import { VIEW_MODES, TIMEZONE_MODES } from '../../utils/constants'
import Filter from '../Filter'

type SidebarProps = {
  children?: ReactNode
  mode: string
  timezone: string
  type: string
  onModeChange(mode: string): void
  onTimezoneChange(timezone: string): void
  onTypeChange(type: string): void
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  children,
  mode,
  timezone,
  type,
  onModeChange,
  onTimezoneChange,
  onTypeChange,
}) => {
  const handleHighContrastModeChange = () => {
    document.body.classList.toggle('high-contrast')
  }

  let modeOptions = []
  for (const mode in VIEW_MODES) {
    const { title, icon } = VIEW_MODES[mode]
    if (VIEW_MODES[mode] !== VIEW_MODES.DESCRIPTION) {
      const name = title.charAt(0).toUpperCase() + title.slice(1)

      const modeOption = (
        <Select.Option value={title} key={title}>
          {createElement(icon)} {`${name}`}
        </Select.Option>
      )
      modeOptions.push(modeOption)
    }
  }

  let timezoneOptions = []
  for (const mode in TIMEZONE_MODES) {
    const { zone, name } = TIMEZONE_MODES[mode]
    const timezoneOption = (
      <Select.Option value={zone} key={zone}>
        <GlobalOutlined /> {`${name}`}
      </Select.Option>
    )
    timezoneOptions.push(timezoneOption)
  }

  return (
    <div className="sidebar">
      <Space direction="vertical">
        <div>
          <Select defaultValue={mode} onChange={onModeChange}>
            {modeOptions}
          </Select>
        </div>

        <div>
          <Select defaultValue={timezone} onChange={onTimezoneChange}>
            {timezoneOptions}
          </Select>
        </div>

        <Filter type={type} onFilterChange={onTypeChange} />

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
