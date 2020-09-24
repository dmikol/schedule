import React, { FunctionComponent, MouseEvent } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

import './TableView.scss'

import { IRow } from '../../models'
import { COLUMNS_DATA } from '../../utils/constants'

type TableViewProps = {
  type: string
  timezone: string
  rows: IRow[]
  handleTaskNameClick(clickedRowKey: string): void
  handleRowClick(clickedRow: IRow, evt: MouseEvent<HTMLElement>): void
  setRowClassName(row: IRow): string
}

const columnsData: ColumnsType<IRow> = Object.values(COLUMNS_DATA)

const TableView: FunctionComponent<TableViewProps> = ({
  type,
  timezone,
  rows,
  handleTaskNameClick,
  handleRowClick,
  setRowClassName,
}) => {
  const columns: ColumnsType<IRow> = columnsData.map((columnItem) => {
    if (columnItem.title === COLUMNS_DATA.TIME.title) {
      columnItem.render = (text: string) => renderTime(text)
    }
    if (columnItem.title === COLUMNS_DATA.NAME.title) {
      columnItem.render = (text: string, row: IRow) => renderName(text, row)
    }
    return columnItem
  })

  const renderTime = (text: string) => {
    return text
      ? `${+text.slice(0, 2) + Number(timezone.slice(0, 2))}${text.slice(2, 5)}`
      : ''
  }

  const renderName = (text: string, row: IRow) => {
    return (
      <h3
        className="tableView__task-name"
        onClick={() => handleTaskNameClick(row.key)}
      >
        {text}
      </h3>
    )
  }

  const filteredRecords =
    type === 'All' ? rows : rows.filter((row) => row.type === type)

  return (
    <div className="table-view">
      <h3>Table view</h3>

      <Table
        columns={columns}
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

export default TableView
