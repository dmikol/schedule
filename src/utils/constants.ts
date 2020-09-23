import { FunctionComponent, ComponentClass } from 'react'
import {
  CalendarOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import { ITask, IRow } from '../models'

export const TYPE_CLASS_NAMES: any = {
  Факультатив: 'row-facultative',
  'YouTube Live': 'row-youtube-live',
  'Выдача таска': 'row-task',
  'Self education': 'row-self-education',
  'Митап в Минске': 'row-meetup',
  Deadline: 'row-deadline',
}

export const VIEW_MODES: {
  [key: string]: {
    title: string
    icon: string | FunctionComponent<{}> | ComponentClass<{}, any>
  }
} = {
  TABLE: {
    title: 'table',
    icon: CalendarOutlined,
  },
  LIST: {
    title: 'list',
    icon: UnorderedListOutlined,
  },
  CALENDAR: {
    title: 'calendar',
    icon: TableOutlined,
  },
  DESCRIPTION: {
    title: 'description',
    icon: '',
  },
}

export const TIMEZONE_MODES: {
  [key: string]: {
    zone: string
    name: string
  }
} = {
  LONDON: {
    zone: '-2London',
    name: 'Europe/London',
  },
  WARSAW: {
    zone: '-1Warsaw',
    name: 'Europe/Warsaw',
  },
  KIEV: {
    zone: '+0Kiev',
    name: 'Europe/Kiev',
  },
  MINSK: {
    zone: '+0Minsk',
    name: 'Europe/Minsk',
  },
  MOSCOW: {
    zone: '+0Moscow',
    name: 'Europe/Moscow',
  },
  VOLGOGRAD: {
    zone: '+1Volgograd',
    name: 'Europe/Volgograd',
  },
  YEKATERINBURG: {
    zone: '+1Yekaterinburg',
    name: 'Europe/Yekaterinburg',
  },
  TASHKENT: {
    zone: '+2Tashkent',
    name: 'Asia/Tashkent',
  },
}

export const CONVERT_TASK_TO_ROW = (task: ITask): IRow => {
  return {
    key: task.id,
    isHighlighted: false,
    isHidden: false,
    title: task.name,
    date: task.dateTime ? task.dateTime.slice(6) : '',
    time: task.dateTime ? task.dateTime.slice(0, 5) : '',
    type: task.type,
    organizer: task.organizer || 'Not assigned',
    place: task.place || '',
    descriptionUrl: task.descriptionUrl || '',
    comment: task.comment || 'No comments yet',
  }
}
