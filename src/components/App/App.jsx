import React, { useState } from 'react'
import { Col, Row } from 'antd'

import './App.scss'

import CalendarView from '../CalendarView'
import Header from '../Header'
import ListView from '../ListView'
import Sidebar from '../Sidebar'
import TableView from '../TableView'
import TaskDescription from '../TaskDescription'

const App = () => {
  const [events] = useState(['Event 1', 'Event 2', 'Event 3'])
  const [mode, setMode] = useState('list')
  const [timezone, setTimezone] = useState('timezone1')

  const handleModeChange = (selectedMode) => {
    console.log(`${selectedMode} mode has been selected`)
    setMode(selectedMode)
  }

  const handleTimezoneChange = (selectedTimezone) => {
    console.log(`${selectedTimezone} timezone has been selected`)
    setTimezone(selectedTimezone)
  }

  const onTaskNameClick = () => {
    setMode('description');
  }

  return (
    <div className="app">
      <Header />

      <Row>
        <Col span={8}>
          <Sidebar
            mode={mode}
            onModeChange={handleModeChange}
            timezone={timezone}
            onTimezoneChange={handleTimezoneChange}
          />
        </Col>

        <Col span={24}>
          {mode === 'calendar' && <CalendarView />}

          {mode === 'list' && <ListView />}


          {mode === 'table' && <TableView mentorMode={mentorMode} 
                                          onTaskNameClick={onTaskNameClick}/>}
                                          
          {mode === 'description' && <TaskDescription />}

        </Col>
      </Row>
    </div>
  )
}

export default App
