import React, { FunctionComponent, useState } from 'react'
import { Col, Descriptions, Row, Typography } from 'antd'

import './TaskDescription.scss'

import { ITask } from '../../models'
import FeedbackOnTask from '../FeedbackOnTask'
import LeaveFeedback from '../LeaveFeedback'
import EditLine from '../EditLine'

import EditableTable from './TaskDescriptionTable'

const { Paragraph } = Typography;

type TaskDescriptionProps = {
  task: ITask
  setClickedTask(task: ITask): void
  timezone: string
  edit: boolean
}

const TaskDescription: FunctionComponent<TaskDescriptionProps> = ({
  task,
  setClickedTask,
  timezone,
  edit
}) => {
  const {
    name,
    type,
    dateTime,
    description,
    descriptionUrl,
    place,
    week,
    photo
  } = task

const [typeStr, setTypeStr] = useState(type)
const [ nameStr, setnNameStr ] = useState(name)

  let link
  if (descriptionUrl) {
    link = (
      <a href={descriptionUrl} target="_blank" rel="noopener noreferrer">
        {descriptionUrl}
      </a>
    )
  }

  let map = null
  if (type === 'Митап' || type === 'Митап в Минске') {
    map = (
      <Descriptions.Item label="Карта" span={3}>
        <iframe
          title={place}
          src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyBP9llkXgAKBFCb-Q_r6bggoz964zqNuXM&q=" + place}
          className="map__iframe"
          frameBorder="0">
        </iframe>
      </Descriptions.Item>
    )
  }

  let editableTable = null
  if (edit) {
    editableTable = (<Row>
      <Col span={20} offset={2}>
        <EditableTable
          task={task}
          edit={edit}/>
      </Col>
    </Row>)
  }

  return (
    <>
      {editableTable}
      <Row>
        <Col span={20} offset={2}>
          <Descriptions title={<EditLine isEdit={edit} text={nameStr}/>} bordered>
            <Descriptions.Item label="Неделя" span={3}>
              {week || 'Описание отсутствует'}
            </Descriptions.Item>

            <Descriptions.Item label="Время и дата" span={3} className="task-desc__highlight">
              {dateTime
                ? `${
                    +dateTime.slice(0, 2) + Number(timezone.slice(0, 2))
                  }${dateTime.slice(2)}`
                : 'Описание отсутствует'}
            </Descriptions.Item>

            <Descriptions.Item label="Тип" span={3}>
              <EditLine isEdit={edit} text={typeStr} />
            </Descriptions.Item>

            <Descriptions.Item label="Cсылка" span={3} className="task-desc__highlight">
              {descriptionUrl ? link : 'Описание отсутствует'}
            </Descriptions.Item>

            <Descriptions.Item label="Описание" span={3}>
              {description || 'Описание Отсутсвует'}
            </Descriptions.Item>

            <Descriptions.Item label="Место проведения" span={3}>
              {place || 'Описание отсутствует'}
            </Descriptions.Item>

            <Descriptions.Item label="Фото" span={3}>
              {photo ? 
              <img className="task-desc__photo" src={photo} alt={name}/> 
              : `Фото отсутствует`}
            </Descriptions.Item>

            <Descriptions.Item label="Видео" span={3}>
              {place === 'youtube' ? 
              <iframe 
                width="500"
                height="300" 
                title={name}
                src={"https://youtube.com/embed/" + descriptionUrl.slice(descriptionUrl.indexOf('=') + 1)} 
                frameBorder="0" 
                allowFullScreen>
              </iframe>
              : `Видео отсутствует`}
            </Descriptions.Item>
            {map}
            </Descriptions>
        </Col>
      </Row>
      
      <Row>
        <Col span={20} offset={2}>
          <FeedbackOnTask feedback={task.feedback} />
        </Col>
      </Row>

      <Row>
        <Col span={20} offset={2}>
          {((task.feedback && task.feedback.isFeedback) || !task.feedback) && (
            <LeaveFeedback task={task} setClickedTask={setClickedTask} />
          )}
        </Col>
      </Row>
    </>
  )
}

export default TaskDescription
