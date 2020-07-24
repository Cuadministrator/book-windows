export const userRoleEnum = {
  1: {
    name: '管理员',
    role: [],
    tab: [
      { id: 'book', title: '预约', iconType: 'bookmark' },
      { id: 'record', title: '记录', iconType: 'list' },
      { id: 'user', title: '用户', iconType: 'user' },
      { id: 'mine', title: '我的', iconType: 'user' }
    ]
  },
  2: {
    name: '普通用户',
    role: ['user', 'record'],
    tab: [
      { id: 'book', title: '预约', iconType: 'bookmark' },
      { id: 'mine', title: '我的', iconType: 'user' }
    ]
  },
}