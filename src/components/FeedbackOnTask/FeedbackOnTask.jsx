import React from 'react'
import {  Card  } from 'antd'

import './FeedbackOnTask.scss'

const FeedbackOnTask = ({ feedback }) => {

    let feedBackContent = null;

    const generateFeedbackCard = (data) => {
        return data.map((item, i) => {
            return <Card title={item.author} bordered={false} key={i}>
            <p>{item.text}</p>
          </Card>
        })
    }

    if (feedback && feedback.data.length) {
        feedBackContent = generateFeedbackCard(feedback.data)
    } else {
        feedBackContent = <h4>Пока еще никто не оставил свой отзыв...</h4>
    }

    return (
        <div className="site-card-border-less-wrapper feedbackOnTask">
            <h2>Отзывы о задании: </h2>
            {feedBackContent}
        </div>

    )
}

export default FeedbackOnTask;