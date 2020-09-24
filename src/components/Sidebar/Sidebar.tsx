import React, { FunctionComponent, ReactNode, createElement } from 'react'
import { Select, Space, Switch, Button } from 'antd'
import { GlobalOutlined, RollbackOutlined } from '@ant-design/icons'

import './Sidebar.scss'

import Filter from '../Filter'
import { VIEW_MODES, TIMEZONE_MODES } from '../../utils/constants'
const { DESCRIPTION } = VIEW_MODES

type SidebarProps = {
  children?: ReactNode
  mode: string
  timezone: string
  type: string
  onModeChange(mode: string): void
  onTimezoneChange(timezone: string): void
  onTypeChange(type: string): void
  onBackToSchedule(): void
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  children,
  mode,
  timezone,
  type,
  onModeChange,
  onTimezoneChange,
  onTypeChange,
  onBackToSchedule
}) => {
  const handleHighContrastModeChange = () => {
    document.body.classList.toggle('high-contrast')
  }

  let modeOptions: ReactNode[] = []
  for (const mode in VIEW_MODES) {
    const { title, icon } = VIEW_MODES[mode]
    if (VIEW_MODES[mode] !== DESCRIPTION) {
      const name = title.charAt(0).toUpperCase() + title.slice(1)

      const modeOption = (
        <Select.Option value={title} key={title}>
          {createElement(icon)} {`${name}`}
        </Select.Option>
      )
      modeOptions.push(modeOption)
    }
  }

  let timezoneOptions: ReactNode[] = []
  for (const mode in TIMEZONE_MODES) {
    const { zone, name } = TIMEZONE_MODES[mode]
    const timezoneOption = (
      <Select.Option value={zone} key={zone}>
        <GlobalOutlined /> {`${name}`}
      </Select.Option>
    )
    timezoneOptions.push(timezoneOption)
  }

  const drawBackButtonIfDescMode = (mode: string) => {
    if (mode === DESCRIPTION.title) {
      return (
        <Button
          onClick={() => onBackToSchedule()}
          className="back-btn">
          <RollbackOutlined />
            Back to schedule
          </Button>
          )
     } else {
       return (
         <>
          <div>
            <Select defaultValue={mode} onChange={onModeChange}>
              {modeOptions}
            </Select>
          </div>

          <Filter type={type} onFilterChange={onTypeChange} />
        </>
       )
     } 
  }

  return (
    <div className="sidebar">
      <Space direction="vertical">
        {
          drawBackButtonIfDescMode(mode)
         }
        <div>
          <Select defaultValue={timezone} onChange={onTimezoneChange}>
            {timezoneOptions}
          </Select>
        </div>

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
