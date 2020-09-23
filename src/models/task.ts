import { IFeedback } from '.'

export interface ITask {
  comment: string
  dateTime: string
  description: string
  descriptionUrl: string
  feedback: {
    data: IFeedback[]
    isFeedback: boolean
  }
  id: string
  name: string
  organizer: string
  place: string
  timeZone: string
  type: string
  week: string
  photo: string
  isHidden?: boolean
  isHighlighted?: boolean
}
