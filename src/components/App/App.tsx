import React, { FunctionComponent, useState } from 'react'
import { Col, Row, Button } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'

import './App.scss'

import { API } from '../../api/api'
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
  const [timezone, setTimezone] = useState('+0Minsk')
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

  const onBackToSchedule = () => {
    setMode('table')
  }

  let arr = [] as string[]
  const download = (name: string, type: string) => {
    if (type === 'txt') {
      const a = document.getElementById('download') as HTMLAnchorElement
      const file = new Blob(arr, { type })
      a.href = URL.createObjectURL(file)
      a.download = name
    } else {
      alert('Извините, но данный формат пока недоступен')
    }
  }

  let num = 0
  const visibleLinksDownload = () => {
    const allLinks: any = document.getElementById('download-links')
    if (num === 0) {
      allLinks.style.display = 'block'
      num = 1
    } else {
      allLinks.style.display = 'none'
      num = 0
    }

    API.getEvents().then((response) => {
      response.forEach((event) => {
        arr.push(` Name: ${event.name}, Date: ${event.dateTime}, 
      Url: ${event.descriptionUrl}, Description: ${event.description}
      --------------------------------------------------------------
      `)
      })
    })
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
            onBackToSchedule={onBackToSchedule}
          >
            <Button.Group>
              <Button
                onClick={() => setCustomColors(true)}
                onBlur={() => setCustomColors(false)}
              >
                <SettingOutlined />
              </Button>

              <Button onClick={() => visibleLinksDownload()}>Download</Button>

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
      </Row>

      <div id="download-links">
        <a
          href=" "
          id="download"
          onClick={() => download('schedule.txt', 'txt')}
          download
        >
          txt
        </a>
      </div>

      {mode === 'calendar' && (
        <CalendarView
          type={type}
          timezone={timezone}
          onTaskNameClick={handleTaskNameClick}
        />
      )}

      {mode === 'list' && (
        <ListView type={type} onTaskNameClick={handleTaskNameClick} />
      )}

      {mode === 'table' && (
        <TableView
          type={type}
          onTaskNameClick={handleTaskNameClick}
          timezone={timezone}
        />
      )}

      {mode === 'description' && clickedTask && (
        <TaskDescription
          task={clickedTask}
          setClickedTask={setClickedTask}
          timezone={timezone}
        />
      )}
    </div>
  )
}

export default App
