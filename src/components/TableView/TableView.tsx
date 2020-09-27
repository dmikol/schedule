import React, { FunctionComponent, MouseEvent } from 'react'
import { Table, Popover, Button, Space, Checkbox } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { InsertRowRightOutlined } from '@ant-design/icons'

import './TableView.scss'

import { IRow } from '../../models'
import { COLUMNS_DATA } from '../../utils/constants'

type ColumnState = {
  title: string
  isColumnHidden: boolean
}[]

type TableViewProps = {
  type: string
  timezone: string
  rows: IRow[]
  mentorMode: boolean
  columnsState: ColumnState
  handleDeleteRowClick(deletedRowKey: string): void
  handleChangeColumnsState(newColumnState: ColumnState): void
  handleTaskNameClick(clickedRowKey: string): void
  handleRowClick(clickedRow: IRow, evt: MouseEvent<HTMLElement>): void
  setRowClassName(row: IRow): string
}

const columnsData: ColumnsType<IRow> = Object.values(COLUMNS_DATA)

const TableView: FunctionComponent<TableViewProps> = ({
  type,
  timezone,
  rows,
  mentorMode,
  columnsState,
  handleDeleteRowClick,
  handleChangeColumnsState,
  handleTaskNameClick,
  handleRowClick,
  setRowClassName,
}) => {
  const columns: ColumnsType<IRow> = columnsData.map((columnItem) => {
    columnsState.forEach((columnStateItem) => {
      if (columnStateItem.title === columnItem.title) {
        columnItem.className = columnStateItem.isColumnHidden ? 'hidden' : ''
      }
    })
    if (columnItem.title === COLUMNS_DATA.TIME.title) {
      columnItem.render = (text: string) => renderTime(text)
    }
    if (columnItem.title === COLUMNS_DATA.NAME.title) {
      columnItem.render = (text: string, row: IRow) => renderName(text, row)
    }

    return columnItem
  })

  if (mentorMode) {
    columns.push({
      title: 'Operation',
      dataIndex: 'operation',
      render: (text: string, row: IRow) => (
        <span
          className="delete-row"
          onClick={() => handleDeleteRowClick(row.key)}
        >
          {text}
        </span>
      ),
    })
  }

  const columnNames: string[] = columnsState.map((column) =>
    !column.isColumnHidden ? column.title : '',
  )

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

  const handleColumnToggle = (evt: any) => {
    const newColumnsState = columnsState.map((column) => {
      if (column.title === evt.target.value) {
        column.isColumnHidden = !column.isColumnHidden
      }
      return column
    })

    handleChangeColumnsState(newColumnsState)
  }

  const popoverContent = () => {
    const checkboxes = columnsState.map((column) => (
      <div key={column.title}>
        <Checkbox onChange={handleColumnToggle} value={column.title}>
          {column.title}
        </Checkbox>
      </div>
    ))

    return (
      <Checkbox.Group defaultValue={columnNames}>{checkboxes}</Checkbox.Group>
    )
  }

  return (
    <div className="table-view">
      <h3>Table view</h3>

      <Space direction="vertical">
        <Space>
          <h3 className="table__edit-titles">Отображение колонок:</h3>
          <Popover content={popoverContent} trigger="click">
            <Button icon={<InsertRowRightOutlined />}>Изменить</Button>
          </Popover>
        </Space>

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
      </Space>
    </div>
  )
}

export default TableView
