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
import AddNewLesson from '../AddNewLesson'

import {
  TYPE_CLASS_NAMES,
  CONVERT_TASK_TO_ROW,
  VIEW_MODES,
  TIMEZONE_MODES,
  COLUMNS_DATA,
} from '../../utils/constants'
const { TABLE, LIST, CALENDAR, DESCRIPTION } = VIEW_MODES
const { MINSK } = TIMEZONE_MODES
const columnsData: ColumnState = Object.values(COLUMNS_DATA).map(
  (columnData) => ({
    title: columnData.title,
    isColumnHidden: false,
  }),
)

type RowData = {
  rows: IRow[]
  isMessageShown: boolean
}

type ColumnState = {
  title: string
  isColumnHidden: boolean
}[]

const App: FunctionComponent = () => {
  const [taskData, setTaskData] = useState<ITask[]>([])
  const [rowData, setRowData] = useState<RowData>({
    rows: [] as IRow[],
    isMessageShown: false,
  })
  const [columnsState, setColumnsState] = useState<ColumnState>(columnsData)
  const [clickedTask, setClickedTask] = useState<ITask | null>(null)
  const [customColors, setCustomColors] = useState(false)
  const [mentorMode, setMentorMode] = useState(true)
  const [mode, setMode] = useState(TABLE.title)
  const [timezone, setTimezone] = useState(MINSK.zone)
  const [type, setTypeSelected] = useState('All')
  const [visibleFilesType, setVisibleFilesType] = useState(false)
  const [visibleLessonForm, setVisibleLessonForm] = useState(false)

  useEffect(() => {
    API.getEvents().then((tasksFromApi) => {
      const rows = tasksFromApi.map((task) => CONVERT_TASK_TO_ROW(task))

      setTaskData(tasksFromApi)
      setRowData((state) => ({ ...state, rows }))
    })
  }, [])

  useEffect(() => {
    API.getEvents().then((tasksFromApi) => {
      const rows = tasksFromApi.map((task) => CONVERT_TASK_TO_ROW(task))

      setRowData((state) => ({ ...state, rows }))
    })
  }, [taskData])

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
    const task = taskData.find((task) => task.id === clickedRowKey)

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
    const deleteLinks = document.querySelectorAll('span.delete-row')

    if (!!nameLinks.length) {
      nameLinks.forEach((link) => {
        if (link === evt.target) isNameClicked = true
      })
    }

    if (!!deleteLinks.length) {
      deleteLinks.forEach((link) => {
        if (link === evt.target) isNameClicked = true
      })
    }

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

  const handleChangeColumnsState = (newColumnState: ColumnState) => {
    setColumnsState(newColumnState)
  }

  const handleDeleteRowClick = (deletedRowKey: string) => {
    const newRows: IRow[] = rowData.rows.map((row) => {
      if (row.key === deletedRowKey) {
        row.title = ''
        row.date = ''
        row.time = ''
        row.organizer = ''
        row.place = ''
        row.descriptionUrl = 'Событие удалено'
        row.comment = ''
        row.type = ''
        row.operation = ''
      }
      return row
    })
    setRowData((state) => ({ ...state, newRows }))
    API.deleteEvent(deletedRowKey)
  }

  const onBackToSchedule = () => {
    setMode(TABLE.title)
  }

  const visibleLinksDownload = () => {
    const allLinks: any = document.getElementById('download-links')

    allLinks.style.display = !visibleFilesType ? 'block' : 'none'

    taskData.forEach((task) => {
      arrayTasksToFile.push(`
      Name: ${task.name},
      Date: ${task.dateTime},
      Url: ${task.descriptionUrl},
      Description: ${task.description}

    --------------------------------------------------------------
    `)
    })
    setVisibleFilesType(!visibleFilesType)
  }

  const arrayTasksToFile = [] as string[]
  const download = (name: string, type: string) => {
    if (type === 'txt') {
      const downloadLink = document.getElementById(
        'download',
      ) as HTMLAnchorElement
      const file = new Blob(arrayTasksToFile, { type })
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = name
    } else {
      alert('Извините, но данный формат пока недоступен')
    }
  }

  const handleAddNewTask = (newTask: ITask) => {
    const newTaskData = [...taskData]

    API.addNewEvent(newTask).then((response) => {
      const updatedNewTask = {
        ...newTask,
        id: response.id,
      }

      newTaskData.push(updatedNewTask)
      setTaskData(newTaskData)
      alert('Событие добавлено!')
    })
  }

  const tableView = (
    <TableView
      type={type}
      timezone={timezone}
      rows={rowData.rows}
      mentorMode={mentorMode}
      columnsState={columnsState}
      handleDeleteRowClick={handleDeleteRowClick}
      handleChangeColumnsState={handleChangeColumnsState}
      handleTaskNameClick={handleTaskNameClick}
      handleRowClick={handleRowClick}
      setRowClassName={setRowClassName}
    />
  )

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

              <Button onClick={visibleLinksDownload}>Download</Button>

              {mentorMode && (
                <Button
                  onClick={() => setVisibleLessonForm(!visibleLessonForm)}
                >
                  <EditOutlined />
                  Add new
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

      {mentorMode && (
        <AddNewLesson
          visibleLessonForm={visibleLessonForm}
          handleAddNewTask={handleAddNewTask}
        />
      )}

      {/* {mode === CALENDAR.title && <CalendarView />} */}
      {mode === CALENDAR.title && (
        <CalendarView
          type={type}
          timezone={timezone}
          events={taskData}
          handleTaskNameClick={handleTaskNameClick}
        />
      )}

      {mode === LIST.title && (
        <ListView
          type={type}
          rows={rowData.rows}
          handleTaskNameClick={handleTaskNameClick}
          handleRowClick={handleRowClick}
          setRowClassName={setRowClassName}
        />
      )}

      {mode === TABLE.title && mentorMode && tableView}
      {mode === TABLE.title && !mentorMode && tableView}

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
