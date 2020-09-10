import React from 'react'
const {  Card  } = antd;

const FeedbackOnTask = ({ feedback }) => {

    let feedBackContent = null;

    const generateFeedbackCard = (data) => {
        return data.map((item, i) => {
            return <Card title={item.author} bordered={false} >
            <p>{item.text}</p>
          </Card>
        })
    }

    if (feedback.data.length) {
        feedBackContent = generateFeedbackCard(feedback.data)
    }

    return (
        <div className="site-card-border-less-wrapper">
            {feedBackContent}
        </div>

    )
}

export default FeedbackOnTask;