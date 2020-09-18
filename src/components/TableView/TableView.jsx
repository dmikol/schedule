import React from 'react'
import { message, Table, Button } from 'antd'

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
      isMessageShown: false,
    }
  }

  findTaskByKey(key) {
    const { events } = this.state
    return events.find((item) => item.id === key)
  }

  componentDidMount() {
    API.getEvents().then((response) => {
      const events = response.data.map((event) => ({
        isHidden: false,
        isHighlighted: false,
        ...event,
      }))
      this.setState({ events })
    })
  }

  mapEventForTable(item, i) {
    return {
      key: item.id,
      isHidden: item.isHidden,
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
    if (record.isHidden) {
      classes += ' hidden'
    }
    return classes
  }

  hideRows() {
    let { events, isMessageShown } = this.state
    events = events.map((event) => {
      if (event.isHighlighted) {
        event.isHidden = true
        event.isHighlighted = false
      }
      return event
    })
    message.destroy()
    isMessageShown = false
    this.setState(() => ({ events, isMessageShown }))
  }

  showRows(record) {
    let { events } = this.state
    events = events.map((event) => {
      if (event.id === record.key) event.isHidden = false
      return event
    })
    this.setState(() => ({ events }))
  }

  showMessageToHideRows(record) {
    const BtnHideRows = () => {
      return (
        <Button onClick={() => this.hideRows()}>Скрыть выделенные ряды</Button>
      )
    }
    const BtnContainer = () => (
      <div className="message__btn-container">
        <BtnHideRows />
      </div>
    )

    message.open({
      duration: 0,
      content: <BtnContainer />,
      className: 'message',
      key: record.key,
    })
  }

  handleRowClick(record, evt) {
    let { events, isMessageShown } = this.state
    let isNameClicked = false
    const nameLinks = document.querySelectorAll('.tableView__task-name')

    nameLinks.forEach((name) => {
      if (name === evt.target) isNameClicked = true
    })

    if (isNameClicked) {
      message.destroy()
      isMessageShown = false
    } else {
      if (record.isHidden) {
        this.showRows(record)
      } else {
        if (!isMessageShown) {
          this.showMessageToHideRows(record)
          isMessageShown = true
        }

        events = events.map((event) => {
          if (event.id === record.key) {
            if (event.isHighlighted) message.destroy()
            event.isHighlighted = !event.isHighlighted
          } else if (!evt.shiftKey) {
            event.isHighlighted = false
          }
          return event
        })

        const highlightedEvents = events.filter((event) => event.isHighlighted)
        if (highlightedEvents.length < 1) isMessageShown = false

        this.setState(() => ({ events, isMessageShown }))
      }
    }
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
              onClick: (evt) => this.handleRowClick(record, evt),
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
