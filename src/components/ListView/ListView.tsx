import React, { Component, ReactNode } from 'react'
import { Avatar, List } from 'antd'

import './ListView.scss'

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

interface ListRecord {
  key: string
  title: ReactNode
  date: string
  time: string
  isHighlighted: boolean
  type: string
  organizer: string
  place: string
  descriptionUrl: string
  comment: string
}

type ListViewProps = {
  type: string
  onTaskNameClick(task: ITask): void
}

type ListViewState = {
  events: ITask[]
  records: ListRecord[]
}

class ListView extends Component<ListViewProps, ListViewState> {
  state = {
    events: [] as ITask[],
    records: [] as ListRecord[],
  }

  componentDidMount() {
    API.getEvents().then((events) => {
      this.setState({
        events,
        records: events.map(this.mapEventToListRecord),
      })
    })
  }

  handleRowClick = (row: ListRecord) => {
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

  mapEventToListRecord = (event: ITask): ListRecord => {
    return {
      key: event.id,
      isHighlighted: false,
      title: (
        <p
          className="tableView__task-name"
          onClick={() => this.props.onTaskNameClick(event)}
        >
          {event.name}
        </p>
      ),
      date: event.dateTime ? event.dateTime.slice(6) : '',
      time: event.dateTime ? event.dateTime.slice(0, 5) : '',
      type: event.type,
      organizer: event.organizer || 'Not assigned',
      place: event.place || '',
      descriptionUrl: event.descriptionUrl || '',
      comment: event.comment || 'No comments yet',
    }
  }

  renderItem = (item: ListRecord): ReactNode => {
    let className = typeClassNames[item.type] || 'row-no-type'

    if (item.isHighlighted) {
      className += ' highlighted'
    }

    return (
      <List.Item
        className={className}
        onClick={() => this.handleRowClick(item)}
      >
        <List.Item.Meta
          avatar={<Avatar src="https://picsum.photos/128" />}
          title={item.title}
          description={item.type}
        />
      </List.Item>
    )
  }

  render() {
    const { type } = this.props
    const { records } = this.state
    const filteredRecords =
      type === 'All' ? records : records.filter((item) => item.type === type)

    return (
      <div className="list-view">
        <h3>List view</h3>

        <List
          itemLayout="horizontal"
          dataSource={filteredRecords}
          renderItem={this.renderItem}
        />
      </div>
    )
  }
}

export default ListView
