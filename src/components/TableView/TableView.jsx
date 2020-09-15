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
              onClick={(title) => {
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
    return events.find((item, i) => i === key)
  }

  componentDidMount() {
    API.getEvents().then((response) => {
      this.setState({ events: response.data })
      console.log(this.state.events)
    })
  }

  mapEventForTable(item, i) {
    return {
      key: i,
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
    return record.type === 'Факультатив'
      ? 'facultativeStyle'
      : record.type === 'YouTube Live'
      ? 'youtubeLiveStyle'
      : record.type === 'Выдача таска'
      ? 'taskStyle '
      : record.type === 'Self education'
      ? 'selfEducationStyle'
      : record.type === 'Митап в Минске'
      ? 'meetUpStyle'
      : record.type === 'Deadline'
      ? 'deadlineStyle'
      : 'noTypeStyle'
  }

  render() {
    const { type } = this.props
    const tableData = this.mapEventsByType(type)
    const filteredData = tableData.filter((item) => item !== null)

    return (
      <div className="table-view">
        <h3>Table view</h3>
        <Table
          columns={this.state.columns}
          dataSource={filteredData}
          rowClassName={this.mapClassNameByType}
          pagination={false}
          scroll={{ x: '100%' }}
        />
      </div>
    )
  }
}

export default TableView

/*
item.type === 'Факультатив'
                ? 'facultativeStyle'
                : item.type === 'YouTube Live'
                ? 'youtubeLiveStyle'
                : item.type === 'Выдача таска'
                ? 'taskStyle '
                : item.type === '	Self education'
                ? 'selfEducationStyle'
                : item.type === 'Митап в Минске'
                ? 'meetUpStyle'
                : item.type === 'Deadline'
                ? 'deadlineStyle'
                : null
*/
