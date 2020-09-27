import React, { Component, ReactNode, MouseEvent } from 'react'
import { Avatar, List } from 'antd'

import './ListView.scss'

import { IRow } from '../../models'

type ListViewProps = {
  type: string
  rows: IRow[]
  handleTaskNameClick(clickedRowKey: string): void
  handleRowClick(clickedRow: IRow, evt: MouseEvent<HTMLElement>): void
  setRowClassName(row: IRow): string
}

class ListView extends Component<ListViewProps> {
  convertRowToListRow = (row: IRow): IRow => {
    const { handleTaskNameClick } = this.props

    return {
      ...row,
      title: (
        <p
          className="tableView__task-name"
          onClick={() => handleTaskNameClick(row.key)}
        >
          {row.title}
        </p>
      ),
    }
  }

  renderItem = (row: IRow): ReactNode => {
    const { handleRowClick, setRowClassName } = this.props
    const className = setRowClassName(row)

    return (
      <List.Item
        className={className}
        onClick={(evt) => handleRowClick(row, evt)}
      >
        <List.Item.Meta
          avatar={<Avatar src="https://picsum.photos/128" />}
          title={row.title}
          description={row.type}
        />
      </List.Item>
    )
  }

  render() {
    const { type, rows } = this.props
    const listRows = rows.map(this.convertRowToListRow)

    const filteredRows =
      type === 'All' ? listRows : listRows.filter((row) => row.type === type)

    return (
      <div className="list-view">
        <h3>List view</h3>

        <List
          itemLayout="horizontal"
          dataSource={filteredRows}
          renderItem={this.renderItem}
        />
      </div>
    )
  }
}

export default ListView
