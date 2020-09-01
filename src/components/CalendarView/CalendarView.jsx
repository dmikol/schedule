import React from 'react'
import { Calendar } from 'antd'

import './CalendarView.scss'

const CalendarView = () => {
  return (
    <div className="calendar-view">
      <h3>Calendar view</h3>

      <Calendar />
    </div>
  )
}

export default CalendarView
