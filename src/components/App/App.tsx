import React, { FunctionComponent, useState } from 'react'
import { Col, Row, Button } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'

import './App.scss'

import { ITask } from '../../models'
import CalendarView from '../CalendarView'
import Header from '../Header'
import ListView from '../ListView'
import Sidebar from '../Sidebar'
import TableView from '../TableView'
import TaskDescription from '../TaskDescription'

const App: FunctionComponent = () => {
  const [clickedTask, setClickedTask] = useState<ITask | null>(null)
  const [customColors, setCustomColors] = useState(false)
  const [mentorMode, setMentorMode] = useState(true)
  const [mode, setMode] = useState('table')
  const [timezone, setTimezone] = useState('timezone1')
  const [type, setTypeSelected] = useState('All')

  const handleModeChange = (selectedMode: string) => {
    setMode(selectedMode)
  }

  const handleTimezoneChange = (selectedTimezone: string) => {
    setTimezone(selectedTimezone)
  }

  const handleTypeSelect = (selectedType: string) => {
    setTypeSelected(selectedType)
  }

  const handleTaskNameClick = (task: ITask) => {
    setMode('description')
    setClickedTask(task)
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
            type={type}
            onTypeChange={handleTypeSelect}
          >
            <Button.Group>
              <Button
                onClick={() => setCustomColors(true)}
                onBlur={() => setCustomColors(false)}
              >
                <SettingOutlined />
              </Button>

              {mentorMode && (
                <Button className="editScheduleButtonStyle">
                  <EditOutlined />
                  Edit schedule
                </Button>
              )}
            </Button.Group>

            {customColors && <div className="customColorsStyle">colors</div>}
          </Sidebar>
        </Col>

        <Col span={16}>
          {mode === 'calendar' && <CalendarView />}

          {mode === 'list' && (
            <ListView type={type} onTaskNameClick={handleTaskNameClick} />
          )}

          {mode === 'table' && (
            <TableView type={type} onTaskNameClick={handleTaskNameClick} />
          )}

          {mode === 'description' && clickedTask && (
            <TaskDescription
              task={clickedTask}
              setClickedTask={setClickedTask}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default App
