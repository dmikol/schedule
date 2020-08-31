import React from 'react'
import { Table } from 'antd'

import './TableView.scss'

const TableView = ({ events = [] }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
  ]

  const data = events.map((item, i) => ({
    key: i,
    title: item,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum, consectetur.',
  }))

  return (
    <div className="table-view">
      <h3>Table view</h3>

      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  )
}

export default TableView
