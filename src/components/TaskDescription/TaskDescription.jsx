import React from 'react';
import { Descriptions, Row, Col } from 'antd';
import FeedbackOnTask from '../FeedbackOnTask';
import LeaveFeedback from '../LeaveFeedback';

const TaskDescription = ({ task, setClickedTask }) => {


    const { name, type, dateTime, description, descriptionUrl, place, week } = task
    let link;
    if(descriptionUrl) {
        link = <a href={descriptionUrl} target="_blank" rel="noopener noreferrer">{descriptionUrl}</a>
    }

    return (
        <>
        <Row>
            <Col span={20} offset={2}>
            <Descriptions title={name} bordered>
                <Descriptions.Item label="Неделя" span={3}>
                    {week ? week : 'Описание отсутствует'}
                </Descriptions.Item>
                <Descriptions.Item label="Время и дата" span={3}>
                    {dateTime ? dateTime : 'Описание отсутствует'}
                </Descriptions.Item>
                <Descriptions.Item label="Тип" span={3}>
                    {type ? type : 'Описание отсутствует'}
                </Descriptions.Item>
                <Descriptions.Item label="Cсылка" span={3}>
                    {descriptionUrl ? link : `Описание отсутствует`}
                </Descriptions.Item>
                <Descriptions.Item label="Описание" span= {3}>
                    {description ? description : `Описание отсутствует`}
                </Descriptions.Item>
                <Descriptions.Item label="Место проведения" span={3}>
                    {place ? place : `Описание отсутствует`}
                </Descriptions.Item>
            </Descriptions>
            </Col>
        </Row>

        <Row>
            <Col span={20} offset={2}>
                <FeedbackOnTask feedback={task.feedback && task.feedback}/>
            </Col>
        </Row>
        <Row>
            <Col span={20} offset={2}>
                {((task.feedback && task.feedback.isFeedback) || !task.feedback) && 
                <LeaveFeedback
                task={task}
                setClickedTask={setClickedTask}/>}
            </Col>
        </Row>

        </>
    )
};

export default TaskDescription;