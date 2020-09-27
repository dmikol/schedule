import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Checkbox,
  DatePicker,
} from 'antd'
import { API } from '../../api/api'
import { ICustom } from '../../models'

const EditableContext = React.createContext<any>(null)

interface Item {
  key: string
  name: string
  age: string
  address: string
  index: string
  [index: string]: any
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>()
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

class TaskDescriptionEdit extends React.Component<any, any> {
  columns: (
    | {
        key: string
        title: string
        dataIndex: string
        width: string
        editable: boolean
        render?: undefined
      }
    | {
        key: string
        title: string
        dataIndex: string
        width?: undefined
        editable?: undefined
        render?: undefined
      }
    | {
        key: string
        title: string
        dataIndex: string
        render: (text: string, record: any) => JSX.Element | null
        width?: undefined
        editable?: undefined
      }
  )[]
  columnsCustom: any[]
  constructor(props: any) {
    super(props)
    this.columns = [
      {
        key: '0',
        title: 'Пункт',
        dataIndex: 'point',
        width: '30%',
        editable: false,
      },
      {
        key: '1',
        title: 'Информация',
        dataIndex: 'info',
        width: '70%',
        editable: true,
      },
    ]
    this.columnsCustom = [
      {
        ...this.columns[0],
        editable: true,
      },
      {
        ...this.columns[1],
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text: string, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <Button>Delete</Button>
            </Popconfirm>
          ) : null,
      },
    ]
  
    let taskEntriesIndex: number = -1

    const mapDataSource = (data: any) => {
      return Object.entries(data).map(([key, value]) => {
        if (['custom', 'feedback', 'id'].includes(key)) return null
        taskEntriesIndex += 1
        return {
          key: taskEntriesIndex,
          point: key,
          info:
            key === 'dateTime' ? (
              <DatePicker
                showTime
                onChange={this.onChangeDate}
                format="HH:mm DD-MM-YYYY"
              />
            ) : value ? (
              value
            ) : (
              'Отсутствует'
            ),
          editable: key === 'dateTime' ? false : true,
        }
      })
    }

    this.state = {
      dataSource: mapDataSource(this.props.task).filter(
        (item) => item !== null,
      ),
      count: Object.keys(props.task).length,
      dataSourceCustom: this.props.task.custom
        ? this.mapCustomDataSource(this.props.task.custom)
        : [],
      countCustom: this.props.task.custom ? this.props.task.custom.length : 0,
      task: props.task,
      loading: false
    }
  }

  onChangeDate = (value: any, dateString: string) => {
    const { task } = this.props
    console.log('no change -------------------');
    
    const taskToUpdate = {
      ...task,
      dateTime: dateString,
    }

    this.handleSaveToServer(taskToUpdate)
    this.props.setClickedTask(taskToUpdate)
  }

  mapCustomDataSource(array: any[]) {
    return array.map((item: ICustom, i: number) => {
      const key = Object.keys(item)[0]
      const value = Object.values(item)[0]
      return {
        key: i,
        point: key ? key : 'Отсутствует',
        info: value ? value : 'Отсутствует',
        editable: true,
      }
    })
  }

  onCheckboxChange = (e: any) => {
    const { task } = this.props

    const taskToUpdate = {
      ...task,
      feedback: {
        isFeedback: e.target.checked,
        data: task.feedback ? task.feedback.data : [],
      },
    }
    this.handleSaveToServer(taskToUpdate)
    this.props.setClickedTask(taskToUpdate)
  }

  handleDelete = (key: any) => {
    const dataSourceCustom = [...this.state.dataSourceCustom]
    this.setState({
      dataSourceCustom: dataSourceCustom.filter((item) => item.key !== key),
    })
    const mappedData = this.mapSavedTaskCustom(
      dataSourceCustom.filter((item) => item.key !== key),
    )
    this.handleSaveToServer(mappedData)
    this.props.setClickedTask(mappedData)
  }

  handleAdd = () => {
    const { countCustom, dataSourceCustom } = this.state
    const newData = {
      key: countCustom,
      point: `Пункт задания`,
      info: 'Описание пункта задания',
      editable: true,
    }
    const mappedTask = this.mapNewAddedTask(newData)
    this.setState({
      dataSourceCustom: [...dataSourceCustom, newData],
      countCustom: countCustom + 1,
      task: mappedTask
    })
    this.handleSaveToServer(mappedTask)
    this.props.setClickedTask(mappedTask)
  }

  mapNewAddedTask(item: any) {
    const { task } = this.state
    const { point, info } = item
    let tempCustom

    if (task.custom) {
      tempCustom = [...task.custom, { [point]: info }]
    } else {
      tempCustom = [{ [point]: info }]
    }

    return {
      ...task,
      custom: tempCustom,
    }
  }

  handleSave = (row: any) => {
    const data = [...this.state.dataSource];
    const filterdFromDatePickerData = data.filter((item) => item.point !== 'dateTime')
    const dataPickerItem = data.find((item) => item.point === 'dateTime')

    const newDataToBeMapped = [
      ...filterdFromDatePickerData,
      {
        key: dataPickerItem.key,
        info: this.props.task.dateTime,
        point: dataPickerItem.point,
        editable: dataPickerItem.editable
      }
    ]
    const dataToState = [
      ...filterdFromDatePickerData,
      {
        key: dataPickerItem.key,
        info:  <DatePicker 
                showTime 
                onChange={this.onChangeDate} 
                format="HH:mm DD-MM-YYYY"
                /> ,
        point: dataPickerItem.point,
        editable: dataPickerItem.editable
      }
    ]
    const index = dataToState.findIndex(item => row.key === item.key);
    const item = dataToState[index];
    dataToState.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: dataToState });
    const mappedData = this.mapSavedTask(newDataToBeMapped)
    this.handleSaveToServer(mappedData);
    this.props.setClickedTask(mappedData)
  }

  handleSaveCustom = (row: any) => {
    const newData = [...this.state.dataSourceCustom]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.setState({ dataSourceCustom: newData })
    const mappedData = this.mapSavedTaskCustom(newData)
    this.handleSaveToServer(mappedData)
    this.props.setClickedTask(mappedData)
  }

  handleSaveToServer(data: any) {
    this.setState({ loading: true })
    API.updateEvent(data.id, data).then(() => this.setState({ loading: false }))
  }

  mapSavedTaskCustom(data: any) {
    return {
      ...this.props.task,
      custom: [
        ...data.map(({ point, info }: { point: string; info: string }) => ({
          [point]: info,
        })),
      ],
    }
  }

  mapSavedTask(data: any) {
    return {
      ...this.props.task,
      ...data.reduce(
        (acc: any, { point, info }: { point: string; info: string }) => ({
          ...acc,
          [point]: info,
        }),
        {},
      ),
    }
  }

  mapColumnsForTable(array: any[]): any {
    array.map((col) => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: (record: any) => {
          return {
            record,
            editable: record.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }
        },
      }
    })
  }

  render() {
    const { dataSource, dataSourceCustom, loading } = this.state
    const { feedback } = this.props.task

    const filteredDataSource = dataSource.filter((item: null) => item !== null)
    const filteredDataSourceCustom = dataSourceCustom.filter(
      (item: null) => item !== null,
    )

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: (record: any) => {
          return {
            record,
            editable: record.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }
        },
      }
    })
    const columnsCustom = this.columnsCustom.map((col) => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: (record: any) => {
          return {
            record,
            editable: record.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSaveCustom,
          }
        },
      }
    })

    return (
      <div>
        <Table
          loading={loading}
          title={() => 'Обязательные поля'}
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredDataSource}
          columns={columns}
        />
        <Table
          loading={loading}
          title={() => 'Кастомные поля'}
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredDataSourceCustom}
          columns={columnsCustom}
        />
        
        <Button disabled={loading} onClick={this.handleAdd} type="dashed" style={{ marginBottom: 16, marginTop: 10 }}>
          Add a row
        </Button>
        <Checkbox disabled={loading} defaultChecked={feedback ? feedback.isFeedback : true} style={{ marginLeft: 10 }} onChange={this.onCheckboxChange}>Разрешить оставлять отзывы</Checkbox>
      </div>
    )
  }
}

export default TaskDescriptionEdit
