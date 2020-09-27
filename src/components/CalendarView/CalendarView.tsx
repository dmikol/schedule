import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { Badge, Button, Calendar, Popover } from 'antd'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Spinner from '../Spinner'

import './CalendarView.scss'

import { ITask } from '../../models'

const eventsColors: any = {
  Факультатив: '#f0e6ef',
  'YouTube Live': '#e1e7f7',
  'Выдача таска': '#e9ddd1',
  'Self education': '#e6f0e9',
  'Митап в Минске': '#f0efe6',
  Deadline: '#ffe4fc',
}

type CalendarViewProps = {
  timezone: string
  type: string
  events: ITask[]
  handleTaskNameClick(clickedRowKey: string): void
}

const CalendarView: FunctionComponent<CalendarViewProps> = ({
  timezone,
  type,
  events,
  handleTaskNameClick,
}) => {
  const [eventsFiltered, setEventsFiltered] = useState<ITask[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setEventsFiltered((prevEvents) =>
      prevEvents.map((event) => ({
        ...event,
        dateTime: `${
          +event.dateTime.slice(0, 2) + Number(timezone.slice(0, 2))
        }${event.dateTime.slice(2)}`,
      })),
    )
  }, [events, timezone])

  useEffect(() => {
    setEventsFiltered(
      type === 'All' ? events : events.filter((event) => event.type === type),
    )
  }, [events, type])

  const getEventsNode = (eventsToRender: ITask[]): ReactNode => {
    return (
      <ul>
        {eventsToRender.map((event) => {
          const popover = (
            <>
              <div>
                <div>
                  <CalendarOutlined /> {event.dateTime.slice(6)}
                </div>

                <div>
                  <ClockCircleOutlined /> {event.dateTime.slice(0, 5)}
                </div>
              </div>

              <p>{event.description}</p>

              <Button
                block
                size="small"
                type="primary"
                onClick={() => handleTaskNameClick(event.id)}
              >
                Details
              </Button>
            </>
          )

          return (
            <li key={event.id}>
              <Popover content={popover} title={event.name} trigger="click">
                <Badge
                  color={eventsColors[event.type] || '#e6eef0'}
                  text={event.name}
                />
              </Popover>
            </li>
          )
        })}
      </ul>
    )
  }

  const dateCellRender = (value: any): ReactNode => {
    const [year, month, day] = value.toJSON().slice(0, 10).split('-')
    const date = `${day}-${month}-${year}`

    return getEventsNode(
      eventsFiltered.filter((event) => event.dateTime.slice(6) === date),
    )
  }

  const monthCellRender = (value: any): ReactNode => {
    const [, month] = value.toJSON().slice(0, 10).split('-')

    return getEventsNode(
      eventsFiltered.filter((event) => event.dateTime.slice(9, 11) === month),
    )
  }

  return (
    <div className="calendar-view">
      <h3>Calendar view</h3>
      {loading ? 
      <Spinner /> : 
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />}
    </div>
  )
}

export default CalendarView
