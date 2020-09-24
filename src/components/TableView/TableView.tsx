import React, { Component } from 'react'
import { Table } from 'antd'
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
  type: string
  organizer: string
  place: string
  descriptionUrl: string
  comment: string
  operation: string
}

type TableViewProps = {
  type: string
  onTaskNameClick(task: ITask): void
  deleteRowClick(): void
  timezone: string
  mentorMode: boolean
}

type TableViewState = {
  columns: ColumnsType<ITask>
  events: ITask[]
  records: TableRecord[]
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
  }
  
  componentDidMount() {
    API.getEvents().then((events) => {
      this.setState({
        events,
        records: events.map(this.mapEventToTableRecord),
      })
    })
    let arrayColumns = this.state.columns;
    if(this.props.mentorMode){
      arrayColumns.push({
        title: 'Operation',
        dataIndex: 'operation',
        render: () => (
          <span className="delete-row"
            onClick={() => this.props.deleteRowClick()}
          >
            Delete
          </span>
        ),
      })
      this.setState({columns: arrayColumns})
    }
  }
  componentDidUpdate(prevProps: any){
    let arrayColumns = this.state.columns;
    if (this.props.mentorMode !== prevProps.mentorMode) {
      if(this.props.mentorMode){
        arrayColumns.push({
          title: 'Operation',
          dataIndex: 'operation',
          render: () => (
            <span className="delete-row"
              onClick={() => this.props.deleteRowClick()}
            >
              Delete
            </span>
          ),
        })
        this.setState({columns: arrayColumns})
      }else if(this.state.columns.length === 9){
        arrayColumns.pop()
        this.setState({columns: arrayColumns})
      }
    }
  }

  getRecordClassName = (record: TableRecord): string => {
    let className = typeClassNames[record.type] || 'row-no-type'

    if (record.isHighlighted) {
      className += ' highlighted'
    }

    return className
  }

  handleRowClick = (row: TableRecord) => {
    const records = this.state.records.map((record) => {
      if (record.key === row.key) {
        record.isHighlighted = !row.isHighlighted
      } else {
        record.isHighlighted = false
      }

      return record
    })

    this.setState({ records })
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
      title: event.name,
      date: event.dateTime ? event.dateTime.slice(6) : '',
      time: event.dateTime ? event.dateTime.slice(0, 5) : '',
      type: event.type,
      organizer: event.organizer || 'Not assigned',
      place: event.place || '',
      descriptionUrl: event.descriptionUrl || '',
      comment: event.comment || 'No comments yet',
      operation: 'delete',
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
            onClick: () => this.handleRowClick(row),
          })}
        />
      </div>
    )
  }
}

export default TableView
