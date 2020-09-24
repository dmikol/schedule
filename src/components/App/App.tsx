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
import AddNewLesson from '../AddNewLesson'

const App: FunctionComponent = () => {
  const [clickedTask, setClickedTask] = useState<ITask | null>(null)
  const [customColors, setCustomColors] = useState(false)
  const [mentorMode, setMentorMode] = useState(true)
  const [mode, setMode] = useState('table')
  const [timezone, setTimezone] = useState('+0Minsk')
  const [type, setTypeSelected] = useState('All')
  const [visibleFilesType, setVisibleFilesType] = useState(false)
  const [visibleLessonForm, setVisibleLessonForm] = useState(false)

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
  const deleteRowClick = () => {
    alert('вы удалили строку')
  }

  const onBackToSchedule = () => {
    setMode('table')
  }
  const visibleLinksDownload = () => {
    
    const allLinks: any = document.getElementById('download-links')
    if (!visibleFilesType) {
      allLinks.style.display = 'block'
    } else {
      allLinks.style.display = 'none'
    }

  }

  API.getEvents().then((response) => {
    response.forEach((event) => {
      arrayTasksToFile.push(` Name: ${event.name}, Date: ${event.dateTime}, 
    Url: ${event.descriptionUrl}, Description: ${event.description}
    --------------------------------------------------------------
    `)
    })
  })

  let arrayTasksToFile = [] as string[]
  const download = (name: string, type: string) => {
    if (type === 'txt') {
      const downloadLink = document.getElementById('download') as HTMLAnchorElement
      const file = new Blob(arrayTasksToFile, { type })
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = name
    } else {
      alert('Извините, но данный формат пока недоступен')
    }
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

              <Button 
              onClick={() => {
                visibleLinksDownload();
                setVisibleFilesType(!visibleFilesType) 
              }}
              >
              Download</Button>

              {mentorMode && (
                <Button 
                onClick={() => setVisibleLessonForm(!visibleLessonForm)}>
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
        <a id="download"
          href=" "
          onClick={() => download('schedule.txt', 'txt')}
          download
        >
          txt
        </a>
      </div>

      {mentorMode && (
      <AddNewLesson 
        visibleLessonForm={visibleLessonForm}
      />
      )}

      {mode === 'calendar' && <CalendarView />}

      {mode === 'list' && (
        <ListView type={type} onTaskNameClick={handleTaskNameClick} />
      )}

      {mode === 'table' && mentorMode && (
        <TableView
          type={type}
          onTaskNameClick={handleTaskNameClick}
          deleteRowClick={deleteRowClick}
          timezone={timezone}
          mentorMode={mentorMode}
        />
      )}
      {mode === 'table' && !mentorMode && (
        <TableView
          type={type}
          onTaskNameClick={handleTaskNameClick}
          deleteRowClick={deleteRowClick}
          timezone={timezone}
          mentorMode={mentorMode}
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
