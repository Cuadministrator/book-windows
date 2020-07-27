import dayjs from 'dayjs'

// utils
import { range } from '../../utils/func'

const now = dayjs()

const startDt = (now.day() > 3 || now.day() === 0) ? now.add(1, 'week').day(3) : now.day(3)

export const bookDtEnum = range(10).map((item: number) => {
  const dt = startDt.add(item, 'week')
  return ({id: item, name: dt.format('YYYY-MM-DD'), value: dt.format('YYYY-MM-DD')})
})

export const bookTimeEnum = [
  {id: 1, name: '10:30-11:30', value: '10:30'},
  {id: 1, name: '14:00-15:00', value: '14:00'},
  {id: 1, name: '16:00-17:00', value: '16:00'},
]
