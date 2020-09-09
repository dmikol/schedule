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
          render: (text) => <h3 onClick={() => props.onTaskNameClick()}>{text}</h3>
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

  componentDidMount() {
    API.getEvents().then((response) => {
      this.setState({ events: response.data })
      console.log(this.state.events)
    })
  }
  render() {
    return (
      <div className="table-view">
        <h3>Table view</h3>

        <Table
          columns={this.state.columns}
          dataSource={this.state.events.map((item, i) => ({
            key: i,
            title: item.name,
            date: item.dateTime ? item.dateTime.slice(6) : '',
            time: item.dateTime ? item.dateTime.slice(0, 5) : '',
            type: item.type,
            organizer: item.organizer ? item.organizer : 'Not assigned',
            place: item.place ? item.place : '',
            descriptionUrl: item.descriptionUrl ? item.descriptionUrl : '',
            comment: item.comment ? item.comment : 'No comments yet',
          }))}
          pagination={false}
        />
      </div>
    )
  }
}

export default TableView
