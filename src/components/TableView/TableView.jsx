import React from 'react'
import { Table } from 'antd'

import './TableView.scss'
import { API } from '../../api/api'

class TableView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'Date',
          dataIndex: 'date',
        },
        {
          title: 'Time',
          dataIndex: 'time',
        },
        {
          title: 'Type',
          dataIndex: 'type',
        },
        {
          title: 'Place',
          dataIndex: 'place',
        },
        {
          title: 'Name',
          dataIndex: 'title',
          render: (text, record) => (
            <h3
              className="tableView__task-name"
              onClick={() => {
                const clickedEvent = this.findTaskByKey(record.key)
                props.onTaskNameClick(clickedEvent)
              }}
            >
              {text}
            </h3>
          ),
        },
        {
          title: 'Details Url',
          dataIndex: 'descriptionUrl',
        },
        {
          title: 'Organizer',
          dataIndex: 'organizer',
        },
        {
          title: 'Comment',
          dataIndex: 'comment',
        },
      ],
      events: [],
    }
  }

  findTaskByKey(key) {
    const { events } = this.state
    return events.find((item) => item.id === key)
  }

  componentDidMount() {
    API.getEvents().then((response) => {
      const events = response.data.map((event) => ({
        isHighlighted: false,
        ...event,
      }))

      this.setState({ events })
      // console.log(this.state.events)
    })
  }

  mapEventForTable(item, i) {
    return {
      key: item.id,
      isHighlighted: item.isHighlighted,
      title: item.name,
      date: item.dateTime ? item.dateTime.slice(6) : '',
      time: item.dateTime ? item.dateTime.slice(0, 5) : '',
      type: item.type,
      organizer: item.organizer ? item.organizer : 'Not assigned',
      place: item.place ? item.place : '',
      descriptionUrl: item.descriptionUrl ? item.descriptionUrl : '',
      comment: item.comment ? item.comment : 'No comments yet',
    }
  }

  mapEventsByType(type) {
    const { events } = this.state

    return events.map((item, i) =>
      type === 'All'
        ? this.mapEventForTable(item, i)
        : type === item.type
        ? this.mapEventForTable(item, i)
        : null,
    )
  }

  mapClassNameByType(record) {
    let classes =
      record.type === 'Факультатив'
        ? 'row-facultative'
        : record.type === 'YouTube Live'
        ? 'row-youtube-live'
        : record.type === 'Выдача таска'
        ? 'row-task'
        : record.type === 'Self education'
        ? 'row-self-education'
        : record.type === 'Митап в Минске'
        ? 'row-meetup'
        : record.type === 'Deadline'
        ? 'row-deadline'
        : 'row-no-type'
    if (record.isHighlighted) {
      classes += ' highlighted'
    }
    return classes
  }

  onRowClick(record, evt) {
    // console.log(evt.shiftKey)
    const { events, columns } = this.state
    const newStateEvents = events.map((event) => {
      if (event.id === record.key) {
        event.isHighlighted = !event.isHighlighted
      } else if (!evt.shiftKey) {
        event.isHighlighted = false
      }
      return event
    })
    this.setState({ ...columns, newStateEvents })
  }

  render() {
    const { type } = this.props
    const tableData = this.mapEventsByType(type)
    const filteredData = tableData.filter((record) => record !== null)

    return (
      <div className="table-view">
        <h3>Table view</h3>
        <Table
          columns={this.state.columns}
          dataSource={filteredData}
          rowClassName={this.mapClassNameByType}
          pagination={false}
          scroll={{ x: '100%' }}
          onRow={(record) => {
            return {
              onClick: (evt) => this.onRowClick(record, evt),
            }
          }}
        />
      </div>
    )
  }
}

export default TableView

/*
item.type === 'Факультатив'
                ? 'row-facultative'
                : item.type === 'YouTube Live'
                ? 'row-youtube-live'
                : item.type === 'Выдача таска'
                ? 'row-task '
                : item.type === '	Self education'
                ? 'row-self-education'
                : item.type === 'Митап в Минске'
                ? 'row-meetup'
                : item.type === 'Deadline'
                ? 'row-deadline'
                : null
*/
