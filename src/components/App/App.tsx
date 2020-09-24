import React, {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useState,
} from 'react'
import { Col, Row, Button, message } from 'antd'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'

import './App.scss'

import { API } from '../../api/api'
import { ITask, IRow } from '../../models'
import CalendarView from '../CalendarView'
import Header from '../Header'
import ListView from '../ListView'
import Sidebar from '../Sidebar'
import TableView from '../TableView'
import TaskDescription from '../TaskDescription'

import {
  TYPE_CLASS_NAMES,
  CONVERT_TASK_TO_ROW,
  VIEW_MODES,
  TIMEZONE_MODES,
} from '../../utils/constants'
const { TABLE, LIST, CALENDAR, DESCRIPTION } = VIEW_MODES
const { MINSK } = TIMEZONE_MODES

type TaskData = {
  tasks: ITask[]
}

type RowData = {
  rows: IRow[]
  isMessageShown: boolean
}

const App: FunctionComponent = () => {
  const [taskData, setTaskData] = useState<TaskData>({
    tasks: [] as ITask[],
  })
  const [rowData, setRowData] = useState<RowData>({
    rows: [] as IRow[],
    isMessageShown: false,
  })
  const [clickedTask, setClickedTask] = useState<ITask | null>(null)
  const [customColors, setCustomColors] = useState(false)
  const [mentorMode, setMentorMode] = useState(true)
  const [mode, setMode] = useState(TABLE.title)
  const [timezone, setTimezone] = useState(MINSK.zone)
  const [type, setTypeSelected] = useState('All')

  useEffect(() => {
    API.getEvents().then((tasksFromApi) => {
      const rows = tasksFromApi.map((task) => CONVERT_TASK_TO_ROW(task))

      setTaskData({ tasks: tasksFromApi })
      setRowData((state) => ({ ...state, rows }))
    })
  }, [])

  const handleModeChange = (selectedMode: string) => {
    setMode(selectedMode)
  }

  const handleTimezoneChange = (selectedTimezone: string) => {
    setTimezone(selectedTimezone)
  }

  const handleTypeSelect = (selectedType: string) => {
    setTypeSelected(selectedType)
  }

  const handleTaskNameClick = (clickedRowKey: string) => {
    const { tasks } = taskData
    const task = tasks.find((task) => task.id === clickedRowKey)

    if (task) {
      setMode(DESCRIPTION.title)
      setClickedTask(task)
    }
  }

  const hideRows = () => {
    const rows = rowData.rows.map((row) => {
      if (row.isHighlighted) {
        row.isHidden = true
        row.isHighlighted = false
      }
      return row
    })

    message.destroy()

    const isMessageShown = false
    setRowData((state) => ({ ...state, rows, isMessageShown }))
  }

  const showRows = (clickedRow: IRow) => {
    const rows = rowData.rows.map((row) => {
      if (row.key === clickedRow.key) row.isHidden = false
      return row
    })
    setRowData((state) => ({ ...state, rows }))
  }

  const showMessageToHideRows = (row: IRow) => {
    const BtnHideRows = () => (
      <div className="message__btn">
        <Button onClick={() => hideRows()}>Скрыть выделенные ряды</Button>
      </div>
    )

    message.open({
      type: 'info',
      duration: 0,
      content: null,
      icon: <BtnHideRows />,
      className: 'message',
      key: row.key,
    })
  }

  const handleRowClick = (clickedRow: IRow, evt: MouseEvent<HTMLElement>) => {
    let { rows, isMessageShown } = rowData
    let isNameClicked = false
    const nameLinks = document.querySelectorAll('.tableView__task-name')

    nameLinks.forEach((name) => {
      if (name === evt.target) isNameClicked = true
    })

    if (isNameClicked) {
      message.destroy()
      isMessageShown = false
    } else {
      if (clickedRow.isHidden) {
        showRows(clickedRow)
      } else {
        if (!isMessageShown) {
          showMessageToHideRows(clickedRow)
          isMessageShown = true
        }

        rows = rows.map((row) => {
          if (row.key === clickedRow.key) {
            if (row.isHighlighted) message.destroy()

            row.isHighlighted = !row.isHighlighted
          } else if (!evt.shiftKey) {
            row.isHighlighted = false
          }
          return row
        })

        const highlightedRows = rows.filter((row) => row.isHighlighted)
        if (highlightedRows.length < 1) isMessageShown = false

        setRowData(() => ({ rows, isMessageShown }))
      }
    }
  }

  const setRowClassName = (row: IRow): string => {
    let className = TYPE_CLASS_NAMES[row.type] || 'row-no-type'

    if (row.isHighlighted) className += ' highlighted'
    if (row.isHidden) className += ' hidden'

    return className
  }

  const onBackToSchedule = () => {
    setMode(TABLE.title)
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

    taskData.tasks.forEach((task) => {
      arr.push(`
      Name: ${task.name},
      Date: ${task.dateTime},
      Url: ${task.descriptionUrl},
      Description: ${task.description}

    --------------------------------------------------------------
    `)
    })
  }

  return (
    <div className="app">
      <Header mentorMode={mentorMode} setMentorMode={setMentorMode} />

      <Row>
        <Col span={8}>
          <Sidebar
            mode={mode}
            timezone={timezone}
            type={type}
            onModeChange={handleModeChange}
            onTimezoneChange={handleTimezoneChange}
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

      {mode === CALENDAR.title && <CalendarView />}

      {mode === LIST.title && (
        <ListView
          type={type}
          rows={rowData.rows}
          handleTaskNameClick={handleTaskNameClick}
          handleRowClick={handleRowClick}
          setRowClassName={setRowClassName}
        />
      )}

      {mode === TABLE.title && (
        <TableView
          type={type}
          timezone={timezone}
          rows={rowData.rows}
          handleTaskNameClick={handleTaskNameClick}
          handleRowClick={handleRowClick}
          setRowClassName={setRowClassName}
        />
      )}

      {mode === DESCRIPTION.title && clickedTask && (
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
