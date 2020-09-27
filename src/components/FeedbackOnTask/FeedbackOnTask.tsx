import React, { FunctionComponent } from 'react'
import { Card } from 'antd'

import './FeedbackOnTask.scss'

import { IFeedback } from '../../models'

type FeedbackOnTaskProps = {
  feedback: {
    isFeedback: boolean
    data: IFeedback[]
  }
}

const FeedbackOnTask: FunctionComponent<FeedbackOnTaskProps> = ({
  feedback,
}) => {
  const generateFeedbackCard = (data: IFeedback[]) => {
    return data.map((item, i) => (
      <Card title={item.author} bordered={false} key={i}>
        <p>{item.text}</p>
      </Card>
    ))
  }

  let feedBackContent = null

  if (feedback && feedback.data.length) {
    feedBackContent = generateFeedbackCard(feedback.data)
  }

  let feedbackComponent = null

  if ((feedback && feedback.isFeedback) || !feedback) {
    feedbackComponent = (
      <div className="site-card-border-less-wrapper feedbackOnTask">
        <h2>Отзывы о задании: </h2>
        {feedBackContent ? (
          feedBackContent
        ) : (
          <h4>Пока еще никто не оставил свой отзыв...</h4>
        )}
      </div>
    )
  }
  return feedbackComponent
}

export default FeedbackOnTask
