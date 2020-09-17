import React from 'react'
import { Avatar, List } from 'antd'

import './ListView.scss'
import { API } from '../../api/api'

class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
    }
  }
  componentDidMount() {
    API.getEvents().then((response) => {
      const events = response.data.map((event) => ({
        isHighlighted: false,
        ...event,
      }))

      this.setState({ events })
      console.log(this.state.events)
    })
  }

  getListItems() {
    const items = this.state.events.map((item) => ({
      key: item.id,
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

  onRowClick(item, evt) {
    const newState = this.state.events.map((event) => {
      if (event.id === item.key) {
        event.isHighlighted = !event.isHighlighted
      } else if (!evt.shiftKey) {
        event.isHighlighted = false
      }
      return event
    })
    this.setState(newState)
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

      return (
        <List.Item
          onClick={(evt) => this.onRowClick(item, evt)}
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
