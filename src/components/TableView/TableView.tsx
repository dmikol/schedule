import React, { Component, MouseEvent } from 'react'
import { Table, Button, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'

import './TableView.scss'

import { API } from '../../api/api'
import { ITask } from '../../models'

const typeClassNames: any = {
  Факультатив: 'row-facultative',
  'YouTube Live': 'row-youtube-live',
  'Выдача таска': 'row-task',
  'Self education': 'row-self-education',
  'Митап в Минске': 'row-meetup',
  Deadline: 'row-deadline',
}

interface TableRecord {
  key: string
  title: string
  date: string
  time: string
  isHighlighted: boolean
  isHidden: boolean
  type: string
  organizer: string
  place: string
  descriptionUrl: string
  comment: string
}

type TableViewProps = {
  type: string
  onTaskNameClick(task: ITask): void
  timezone: string
}

type TableViewState = {
  columns: ColumnsType<ITask>
  events: ITask[]
  records: TableRecord[]
  isMessageShown: boolean
}

class TableView extends Component<TableViewProps, TableViewState> {
  state = {
    columns: [
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        render: (text: string) => {
          return text
            ? `${
                +text.slice(0, 2) + Number(this.props.timezone.slice(0, 2))
              }${text.slice(2, 5)}`
            : ''
        },
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
        render: (text: string, record: any) => (
          <h3
            className="tableView__task-name"
            onClick={() => this.handleTaskClick(record.key)}
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
    events: [] as ITask[],
    records: [] as TableRecord[],
    isMessageShown: false,
  }

  componentDidMount() {
    API.getEvents().then((events) => {
      this.setState({
        events,
        records: events.map(this.mapEventToTableRecord),
      })
    })
  }

  getRecordClassName = (record: TableRecord): string => {
    let className = typeClassNames[record.type] || 'row-no-type'

    if (record.isHighlighted) {
      className += ' highlighted'
    }
    if (record.isHidden) {
      className += ' hidden'
    }

    return className
  }

  hideRows = () => {
    const records = this.state.records.map((event) => {
      if (event.isHighlighted) {
        event.isHidden = true
        event.isHighlighted = false
      }
      return event
    })

    message.destroy()

    const isMessageShown = false
    this.setState(() => ({ records, isMessageShown }))
  }

  showRows = (clickedRecord: TableRecord) => {
    const records = this.state.records.map((record) => {
      if (record.key === clickedRecord.key) record.isHidden = false
      return record
    })
    this.setState(() => ({ records }))
  }

  showMessageToHideRows(record: TableRecord) {
    const BtnHideRows = () => (
      <div className="message__btn">
        <Button onClick={() => this.hideRows()}>Скрыть выделенные ряды</Button>
      </div>
    )

    message.open({
      type: 'info',
      duration: 0,
      content: null,
      icon: <BtnHideRows />,
      className: 'message',
      key: record.key,
    })
  }

  handleRowClick = (row: TableRecord, evt: MouseEvent<HTMLElement>) => {
    let { isMessageShown } = this.state
    let isNameClicked = false
    const nameLinks = document.querySelectorAll('.tableView__task-name')

    nameLinks.forEach((name) => {
      if (name === evt.target) isNameClicked = true
    })

    if (isNameClicked) {
      message.destroy()
      isMessageShown = false
    } else {
      if (row.isHidden) {
        this.showRows(row)
      } else {
        if (!isMessageShown) {
          this.showMessageToHideRows(row)
          isMessageShown = true
        }

        const records = this.state.records.map((record) => {
          if (record.key === row.key) {
            if (record.isHighlighted) message.destroy()

            record.isHighlighted = !record.isHighlighted
          } else if (!evt.shiftKey) {
            record.isHighlighted = false
          }
          return record
        })

        const highlightedRows = records.filter((event) => event.isHighlighted)
        if (highlightedRows.length < 1) isMessageShown = false

        this.setState(() => ({ records, isMessageShown }))
      }
    }
  }

  handleTaskClick = (id: string) => {
    const { events } = this.state
    const event = events.find((item) => item.id === id)

    if (event) {
      this.props.onTaskNameClick(event)
    }
  }

  mapEventToTableRecord = (event: ITask): TableRecord => {
    return {
      key: event.id,
      isHighlighted: false,
      isHidden: false,
      title: event.name,
      date: event.dateTime ? event.dateTime.slice(6) : '',
      time: event.dateTime ? event.dateTime.slice(0, 5) : '',
      type: event.type,
      organizer: event.organizer || 'Not assigned',
      place: event.place || '',
      descriptionUrl: event.descriptionUrl || '',
      comment: event.comment || 'No comments yet',
    }
  }

  render() {
    const { type } = this.props
    const { columns, records } = this.state
    const filteredRecords =
      type === 'All' ? records : records.filter((item) => item.type === type)

    return (
      <div className="table-view">
        <h3>Table view</h3>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowClassName={this.getRecordClassName}
          pagination={false}
          scroll={{ x: '100%' }}
          onRow={(row) => ({
            onClick: (evt) => this.handleRowClick(row, evt),
          })}
        />
      </div>
    )
  }
}

export default TableView
