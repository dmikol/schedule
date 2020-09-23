import React, { Component, MouseEvent } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

import './TableView.scss'

import { IRow } from '../../models'

type TableViewProps = {
  type: string
  timezone: string
  rows: IRow[]
  handleTaskNameClick(clickedRowKey: string): void
  handleRowClick(clickedRow: IRow, evt: MouseEvent<HTMLElement>): void
  setRowClassName(row: IRow): string
}

class TableView extends Component<TableViewProps> {
  columns: ColumnsType<IRow> = [
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
      render: (text: string, row: IRow) => (
        <h3
          className="tableView__task-name"
          onClick={() => this.props.handleTaskNameClick(row.key)}
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
  ]

  render() {
    const { type, rows, handleRowClick, setRowClassName } = this.props
    console.log(rows)
    const filteredRecords =
      type === 'All' ? rows : rows.filter((row) => row.type === type)

    return (
      <div className="table-view">
        <h3>Table view</h3>

        <Table
          columns={this.columns}
          dataSource={filteredRecords}
          rowClassName={setRowClassName}
          pagination={false}
          scroll={{ x: '100%' }}
          onRow={(row) => ({
            onClick: (evt) => handleRowClick(row, evt),
          })}
        />
      </div>
    )
  }
}

export default TableView
