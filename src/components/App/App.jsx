import React, { useState } from 'react'
import { Col, Row, Button } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import './App.scss'

import CalendarView from '../CalendarView'
import Header from '../Header'
import ListView from '../ListView'
import Sidebar from '../Sidebar'
import TableView from '../TableView'

const App = () => {
  const [events] = useState(['Event 1', 'Event 2', 'Event 3'])
  const [mode, setMode] = useState('table')
  const [timezone, setTimezone] = useState('timezone1')

  const [mentorMode, setMentorMode] = useState(true)
  const [customColors, setCustomColors] = useState(false)

  const handleModeChange = (selectedMode) => {
    console.log(`${selectedMode} mode has been selected`)
    setMode(selectedMode)
  }

  const handleTimezoneChange = (selectedTimezone) => {
    console.log(`${selectedTimezone} timezone has been selected`)
    setTimezone(selectedTimezone)
  }

  return (
    <div className="app">
      <Header mentorMode={mentorMode} setMentorMode={setMentorMode} />

      <Row>
        <Col span={8}>
          <Sidebar
            mode={mode}
            onModeChange={handleModeChange}
            timezone={timezone}
            onTimezoneChange={handleTimezoneChange}
          />
        </Col>
        {mentorMode && (
          <Col span={24} offset={21}>
            <Button className="editScheduleButtonStyle">
              Edit schedule
              <EditOutlined />
            </Button>

            <Button
              onClick={() => setCustomColors(true)}
              onBlur={() => setCustomColors(false)}
            >
              <SettingOutlined />
            </Button>
          </Col>
        )}
        {!mentorMode && (
          <Col span={24} offset={23}>
            <Button
              onClick={() => setCustomColors(true)}
              onBlur={() => setCustomColors(false)}
            >
              <SettingOutlined />
            </Button>
          </Col>
        )}
        {customColors && <div className="customColorsStyle">colors</div>}
        <Col span={24}>
          {mode === 'calendar' && <CalendarView />}

          {mode === 'list' && <ListView />}

          {mode === 'table' && <TableView mentorMode={mentorMode} />}
        </Col>
      </Row>
    </div>
  )
}

export default App
