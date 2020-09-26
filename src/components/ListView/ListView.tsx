import React, { Component, ReactNode, MouseEvent } from 'react'
import { Avatar, List, Button, message } from 'antd'

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
  isHidden: boolean
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
  isMessageShown: boolean
}

class ListView extends Component<ListViewProps, ListViewState> {
  state = {
    events: [] as ITask[],
    records: [] as ListRecord[],
    isMessageShown: false,
  }

  componentDidMount() {
    API.getEvents().then((events) => {
      this.setState({
        events,
        records: events.map(this.mapEventToListRecord),
      })
    })
  }

  hideRows = () => {
    const records = this.state.records.map((record) => {
      if (record.isHighlighted) {
        record.isHidden = true
        record.isHighlighted = false
      }
      return record
    })

    message.destroy()

    const isMessageShown = false
    this.setState(() => ({ records, isMessageShown }))
  }

  showRows = (clickedRecord: ListRecord) => {
    const records = this.state.records.map((record) => {
      if (record.key === clickedRecord.key) record.isHidden = false
      return record
    })
    this.setState(() => ({ records }))
  }

  showMessageToHideRows = (record: ListRecord) => {
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

  handleRowClick = (row: ListRecord, evt: MouseEvent<HTMLElement>) => {
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
            record.isHighlighted && message.destroy()

            record.isHighlighted = !record.isHighlighted
          } else if (!evt.shiftKey) {
            record.isHighlighted = false
          }

          return record
        })

        const highlightedRows = records.filter((record) => record.isHighlighted)
        if (highlightedRows.length < 1) isMessageShown = false

        this.setState(() => ({ records, isMessageShown }))
      }
    }
  }

  mapEventToListRecord = (event: ITask): ListRecord => {
    return {
      key: event.id,
      isHighlighted: false,
      isHidden: false,
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
    if (item.isHidden) {
      className += ' hidden'
    }

    return (
      <List.Item
        className={className}
        onClick={(evt) => this.handleRowClick(item, evt)}
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
