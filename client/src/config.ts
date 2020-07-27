export const userRoleEnum = {
  1: {
    name: '管理员',
    role: ['book', 'record', 'user', 'mine'],
    tab: [
      { id: 'book', title: '预约', iconType: 'bookmark' },
      { id: 'record', title: '记录', iconType: 'list' },
      { id: 'user', title: '用户', iconType: 'user' },
      { id: 'mine', title: '我的', iconType: 'user' }
    ]
  },
  2: {
    name: '普通用户',
    role: ['book', 'record', 'mine'],
    tab: [
      { id: 'book', title: '预约', iconType: 'bookmark' },
      { id: 'record', title: '记录', iconType: 'list' },
      { id: 'mine', title: '我的', iconType: 'user' }
    ]
  },
  3: {
    name: '未登录用户',
    role: ['mine'],
    tab: [
      { id: 'mine', title: '我的', iconType: 'user' }
    ]
  }
}

export const tempMessage = [
  'NB9mU7pksIbQaZ_xl4IGEFwH3zM7qsPr3gxK9-qEqGU'
]