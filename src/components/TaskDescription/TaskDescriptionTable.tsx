import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext<any>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  index: string
  [index: string]: any;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
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
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async() => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

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
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


class EditableTable extends React.Component<any, any> {
  columns: ({ key: string; title: string; dataIndex: string; width: string; editable: boolean; render?: undefined; } | { key: string; title: string; dataIndex: string; width?: undefined; editable?: undefined; render?: undefined; } | { key: string; title: string; dataIndex: string; render: (text: string, record: any) => JSX.Element | null; width?: undefined; editable?: undefined; })[];
  columnsCustom: any[];
  constructor(props: any) {
    super(props);
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
      }
    ];
    this.columnsCustom = [
      {
        ...this.columns[0],
        editable: true,
      },
      {
        ...this.columns[1]
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text: string, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ]
    let taskEntriesIndex: number = -1;
    this.state = {
      dataSource: Object.entries(this.props.task).map(([ key, value ]) => {
        taskEntriesIndex += 1
        return {
          key: taskEntriesIndex,
          point: key,
          info: value ? value : 'Отсутствует',
          editable: key === 'id' ? false : true
        }
      }),
      count: Object.keys(props.task).length,
      dataSourceCustom: [],
      countCustom: 0,
    };
  }

  handleDelete = (key: any) => {
    const dataSourceCustom = [...this.state.dataSourceCustom];
    this.setState({ dataSourceCustom: dataSourceCustom.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { countCustom, dataSourceCustom } = this.state;
    const newData = {
      key: countCustom,
      point: `Пункт задания`,
      info: 'Описание пункта задания',
      editable: true
    };
    this.setState({
      dataSourceCustom: [...dataSourceCustom, newData],
      countCustom: countCustom + 1,
    });
  };

  handleSave = (row: any) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    console.log(newData);
  };

  mapColumnsForTable(array: any[]): any {
    array.map(col => {
      if (!col.editable) {
        return col;
      }
       
      return {
        ...col,
        onCell: (record: any) => {
        console.log('record = ', record);
        
          return {
          record,
          editable: record.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }}
      };
    });
  }

  render() {
    const { dataSource, dataSourceCustom } = this.state;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
       
      return {
        ...col,
        onCell: (record: any) => {
        console.log('record = ', record);
        
          return {
          record,
          editable: record.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }}
      };
    });
    const columnsCustom = this.columnsCustom.map(col => {
      if (!col.editable) {
        return col;
      }
       
      return {
        ...col,
        onCell: (record: any) => {
        console.log('record = ', record);
        
          return {
          record,
          editable: record.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }}
      };
    });
    return (
      <div>
        <Table
          title={() => 'Обязательные поля'}
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <Table
          title={() => 'Кастомные поля'}
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSourceCustom}
          columns={columnsCustom}
        />
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
      </div>
    );
  }
}

export default EditableTable;