import { ReactNode } from 'react'

export interface IRow {
  key: string
  title: string | ReactNode
  date: string
  time: string
  isHighlighted: boolean
  isHidden: boolean
  type: string
  organizer: string
  place: string
  descriptionUrl: string
  comment: string
  operation?: string
}
