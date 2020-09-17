import React, { useState } from 'react'
import { Col, Row, Button } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import './App.scss'

import CalendarView from '../CalendarView'
import Header from '../Header'
import ListView from '../ListView'
import Sidebar from '../Sidebar'
import TableView from '../TableView'
import TaskDescription from '../TaskDescription'
import { API } from '../../api/api'

const App = () => {
  const [mode, setMode] = useState('table')
  const [timezone, setTimezone] = useState('+0Minsk')
  const [type, setTypeSelected] = useState('All')

  const [mentorMode, setMentorMode] = useState(true)
  const [customColors, setCustomColors] = useState(false)
  const [clickedTask, setClickedTask] = useState(null)

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode)
  }

  const handleTimezoneChange = (selectedTimezone) => {
    setTimezone(selectedTimezone)
  }

  const handleTypeSelected = (selectedType) => {
    setTypeSelected(selectedType)
  }

  const handleTaskNameClick = (task) => {
    setMode('description')
    setClickedTask(task)

  }
  let arr = [];

  const download = (name, type) => {
    if(type === "txt"){
      let a = document.getElementById("download");
      let file = new Blob([arr], {type: type});
      a.href = URL.createObjectURL(file); 
      a.download = name;
    }else{
      alert('Извините, но данный формат пока недоступен')
    }
  }

  let num = 0;
  const visibleLinksDownload = () => {
    let allLinks = document.getElementById("download-links");
    if(num === 0){
    allLinks.style.display = "block";
    num = 1;
    }else{
    allLinks.style.display = "none";
    num = 0;
  }

  API.getEvents().then((response) => {
      response.data.forEach((event) => {
      arr.push(` Name: ${event.name}, Date: ${event.dateTime}, 
      Url: ${event.descriptionUrl}, Description: ${event.description}
      --------------------------------------------------------------
      `);
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
            onTypeChange={handleTypeSelected}
          />

          <div>
            <Button.Group>
              <Button
                onClick={() => setCustomColors(true)}
                onBlur={() => setCustomColors(false)}
              >
              <SettingOutlined />
              </Button>
              <Button
                onClick={() => visibleLinksDownload()}
              >Download</Button>

              {mentorMode && (
                <Button className="editScheduleButtonStyle">
                  <EditOutlined />
                  Edit schedule
                </Button>
              )}
            </Button.Group>
            {customColors && <div className="customColorsStyle">colors</div>}
          </div>
        </Col>
      </Row>
      <Row>
      <div id="download-links">
         <a href="" id="download" onClick={() => download('schedule.txt', 'txt')} download>txt</a>
         <a href="#" id="download" onClick={() => download('schedule.html', 'html')}>html</a>
         <a href="#" id="download" onClick={() => download('schedule.xlsx', 'xlsx')}>xlsx</a>
         <a href="#" id="download" onClick={() => download('schedule.docx', 'docx')}>docx</a>
      </div>
        <Col span={24}>
          {mode === 'calendar' && <CalendarView />}

          {mode === 'list' && (
            <ListView onTaskNameClick={handleTaskNameClick} />
          )}

          {mode === 'table' && (
            <TableView
              type={type}
              mentorMode={mentorMode}
              onTaskNameClick={handleTaskNameClick}
              timezone={timezone}
            />
          )}

          {mode === 'description' && (
            <TaskDescription
              task={clickedTask}
              setClickedTask={setClickedTask}
              timezone={timezone}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default App
