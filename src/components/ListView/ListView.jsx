import React from 'react'
import { Avatar, List, Button, message } from 'antd'

import './ListView.scss'
import { API } from '../../api/api'

class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      isMessageShown: false,
    }
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

  getListItems() {
    const items = this.state.events.map((item) => ({
      key: item.id,
      isHidden: item.isHidden,
      isHighlighted: item.isHighlighted,
      title: (
        <p
          className="tableView__task-name"
          onClick={() => this.props.onTaskNameClick(item)}
        >
          {item.name}
        </p>
      ),
      date: item.dateTime ? item.dateTime.slice(6) : '',
      time: item.dateTime ? item.dateTime.slice(0, 5) : '',
      type: item.type,
      organizer: item.organizer ? item.organizer : 'Not assigned',
      place: item.place ? item.place : '',
      descriptionUrl: item.descriptionUrl ? item.descriptionUrl : '',
      comment: item.comment ? item.comment : 'No comments yet',
    }))
    return items
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

  showRows(item) {
    let { events } = this.state
    events = events.map((event) => {
      if (event.id === item.key) event.isHidden = false
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

  handleRowClick(item, evt) {
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
      if (item.isHidden) {
        this.showRows(item)
      } else {
        if (!isMessageShown) {
          this.showMessageToHideRows(item)
          isMessageShown = true
        }

        events = events.map((event) => {
          if (event.id === item.key) {
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

  renderItems() {
    return (item) => {
      let classes =
        item.type === 'Факультатив'
          ? 'row-facultative'
          : item.type === 'YouTube Live'
          ? 'row-youtube-live'
          : item.type === 'Выдача таска'
          ? 'row-task'
          : item.type === 'Self education'
          ? 'row-self-education'
          : item.type === 'Митап в Минске'
          ? 'row-meetup'
          : item.type === 'Deadline'
          ? 'row-deadline'
          : 'row-no-type'
      if (item.isHighlighted) {
        classes += ' highlighted'
      }
      if (item.isHidden) {
        classes += ' hidden'
      }

      return (
        <List.Item
          onClick={(evt) => this.handleRowClick(item, evt)}
          className={classes}
        >
          <List.Item.Meta
            avatar={<Avatar src="https://picsum.photos/128" />}
            title={item.title}
            description={item.type}
          />
        </List.Item>
      )
    }
  }

  render() {
    return (
      <div className="list-view">
        <h3>List view</h3>

        <List
          itemLayout="horizontal"
          dataSource={this.getListItems()}
          renderItem={this.renderItems()}
        />
      </div>
    )
  }
}

export default ListView
